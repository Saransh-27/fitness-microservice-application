import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import keycloak, { getKeycloakConfig } from "../services/keycloak";
import { useAuthStore } from "../store/useAuthStore";
import { userService } from "../services/userService";
import api, { createAuthenticatedApi } from "../services/api";
import type { UserResponse } from "../types";

interface KeycloakContextValue {
  initialized: boolean;
  authenticated: boolean;
  login: () => void;
  loginSocial: (provider: "google" | "github") => void;
  loginDirect: (username: string, password?: string) => Promise<boolean>;
  registerDirect: (userDto: {
    username: string;
    email: string;
    password?: string;
    frontname?: string;
    lastname?: string;
  }) => Promise<boolean>;
  logout: () => void;
  token: string | undefined;
}

const KeycloakContext = createContext<KeycloakContextValue>({
  initialized: false,
  authenticated: false,
  login: () => {},
  loginSocial: () => {},
  loginDirect: async () => false,
  registerDirect: async () => false,
  logout: () => {},
  token: undefined,
});

export function KeycloakProvider({ children }: { children: ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const { setAuth, clearAuth } = useAuthStore();
  const isInitializedRef = useRef(false);

  const syncUser = useCallback(async () => {
    if (!keycloak.authenticated || !keycloak.tokenParsed) return;

    const keycloakId = keycloak.tokenParsed.sub as string;
    const token = keycloak.token as string;

    // Store the token first so api.ts interceptor can use it
    const kcUser: UserResponse = {
      id: keycloakId,
      keycloakId,
      username: keycloak.tokenParsed.preferred_username || "athlete",
      email: keycloak.tokenParsed.email || "",
      frontname: keycloak.tokenParsed.given_name || "",
      lastname: keycloak.tokenParsed.family_name || "",
      password: "",
      role: "USER" as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Set auth first so that API calls via api.ts have a valid token
    setAuth(kcUser, keycloakId, token);

    // Now try to fetch the real user profile from backend
    try {
      const user = await userService.getUserById(keycloakId);
      setAuth(user, keycloakId, token);
    } catch (error) {
      console.warn("Could not fetch user profile from backend, using JWT claims:", error);
      // kcUser already set above, no need to fallback
    }
  }, [setAuth]);

  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    keycloak
      .init({
        onLoad: "check-sso",
        silentCheckSsoRedirectUri:
          window.location.origin + "/silent-check-sso.html",
        pkceMethod: "S256",
        checkLoginIframe: false,
      })
      .then(async (authenticated) => {
        if (authenticated) {
          await syncUser();
          if (
            window.location.pathname === "/login" ||
            window.location.pathname === "/register" ||
            window.location.pathname === "/"
          ) {
            window.history.replaceState({}, document.title, "/dashboard");
          }
        }
        setInitialized(true);
      })
      .catch((err) => {
        console.warn("Keycloak SSO init (server may be offline):", err);
        setInitialized(true);
      });

    keycloak.onTokenExpired = () => {
      keycloak
        .updateToken(30)
        .then((refreshed) => {
          if (refreshed) {
            syncUser();
          }
        })
        .catch(() => {
          clearAuth();
        });
    };
  }, [syncUser, clearAuth]);

  const login = useCallback(() => {
    keycloak.login().catch((err) => {
      console.error("Keycloak login redirect error:", err);
    });
  }, []);

  const loginSocial = useCallback((provider: "google" | "github") => {
    keycloak
      .login({
        idpHint: provider,
      })
      .catch((err) => {
        console.error(`Keycloak ${provider} social login error:`, err);
      });
  }, []);

  const loginDirect = useCallback(
    async (username: string, password?: string): Promise<boolean> => {
      const { url, realm, clientId } = getKeycloakConfig();
      const tokenEndpoint = `${url}/realms/${realm}/protocol/openid-connect/token`;

      // 1. Get token from Keycloak via Direct Access Grant
      const params = new URLSearchParams();
      params.append("client_id", clientId);
      params.append("grant_type", "password");
      params.append("username", username);
      if (password) params.append("password", password);

      let res: Response;
      try {
        res = await fetch(tokenEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params,
        });
      } catch (err: any) {
        throw new Error(
          `Unable to connect to Keycloak at ${url}. Please ensure Keycloak is running.`
        );
      }

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error(
            "Keycloak 403 Forbidden: In Keycloak Admin Console -> Clients -> oauth2-pkce-client, set 'Client authentication' to OFF and enable 'Direct access grants'."
          );
        }
        const errorData = await res.json().catch(() => ({}));
        const message =
          errorData.error_description ||
          errorData.error ||
          "Invalid username or password.";
        throw new Error(message);
      }

      const data = await res.json();
      const token = data.access_token;
      const refreshToken = data.refresh_token;

      // 2. Parse JWT payload
      let payload: any = {};
      try {
        payload = JSON.parse(atob(token.split(".")[1]));
      } catch (e) {
        console.error("Failed to parse JWT:", e);
      }

      const keycloakId = payload.sub;
      if (!keycloakId) {
        throw new Error("Invalid token received from Keycloak (missing sub claim).");
      }

      // 3. Create a temporary authenticated API client with this token
      //    (because Zustand store hasn't been set yet, so the default api.ts interceptor has no token)
      const tempApi = createAuthenticatedApi(token);

      // 4. Fetch the user from backend DB via API Gateway using the token
      let userObj: UserResponse;
      try {
        const { data: userData } = await tempApi.get<UserResponse>(`/apis/users/${keycloakId}`);
        userObj = userData;
      } catch {
        // User not in DB yet — the KeycloakUserSyncFilter on the gateway should auto-register,
        // but if it failed or this is a race condition, try explicit registration
        try {
          const { data: regData } = await tempApi.post<UserResponse>("/apis/users/register", {
            keycloakId,
            username: payload.preferred_username || username,
            email: payload.email || `${username.toLowerCase()}@fitness.com`,
            frontname: payload.given_name || username,
            lastname: payload.family_name || "User",
            password: password || "keycloak-managed",
          });
          userObj = regData;
        } catch (regErr) {
          // Last resort: construct from JWT claims so the app is usable
          userObj = {
            id: keycloakId,
            keycloakId,
            username: payload.preferred_username || username,
            email: payload.email || "",
            frontname: payload.given_name || username,
            lastname: payload.family_name || "User",
            password: "",
            role: "USER" as any,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
      }

      // 5. Store in Zustand — now api.ts interceptor will have the token for all future requests
      setAuth(userObj, keycloakId, token);
      return true;
    },
    [setAuth]
  );

  const registerDirect = useCallback(
    async (userDto: {
      username: string;
      email: string;
      password?: string;
      frontname?: string;
      lastname?: string;
    }): Promise<boolean> => {
      // 1. Call API Gateway server-side registration endpoint
      //    (Creates user in Keycloak via Admin API + syncs to PostgreSQL database)
      try {
        await api.post("/gateway/register", userDto);
      } catch (err: any) {
        const errorMsg =
          err?.response?.data?.message ||
          err?.response?.data ||
          err?.message ||
          "Registration failed. Could not connect to API Gateway.";
        throw new Error(
          typeof errorMsg === "string" ? errorMsg : "Registration failed."
        );
      }

      // 2. Log in with the new Keycloak credentials to obtain a real JWT token
      if (userDto.password) {
        const success = await loginDirect(userDto.username, userDto.password);
        if (success) return true;
      }

      return true;
    },
    [loginDirect]
  );

  const logout = useCallback(() => {
    clearAuth();
    if (keycloak.authenticated) {
      keycloak.logout({ redirectUri: window.location.origin });
    } else {
      window.location.href = "/login";
    }
  }, [clearAuth]);

  const storeIsAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const storeToken = useAuthStore((state) => state.token);
  const isAuthenticated = storeIsAuthenticated || keycloak.authenticated;

  return (
    <KeycloakContext.Provider
      value={{
        initialized,
        authenticated: Boolean(isAuthenticated),
        login,
        loginSocial,
        loginDirect,
        registerDirect,
        logout,
        token: storeToken || keycloak.token || undefined,
      }}
    >
      {children}
    </KeycloakContext.Provider>
  );
}

export function useKeycloak() {
  const context = useContext(KeycloakContext);
  if (!context) {
    throw new Error("useKeycloak must be used within KeycloakProvider");
  }
  return context;
}
