import Keycloak from "keycloak-js";

// Read from localStorage overrides or environment variables
const keycloakUrl =
  localStorage.getItem("KEYCLOAK_URL") ||
  import.meta.env.VITE_KEYCLOAK_URL ||
  "http://localhost:8181";

const keycloakRealm =
  localStorage.getItem("KEYCLOAK_REALM") ||
  import.meta.env.VITE_KEYCLOAK_REALM ||
  "fitness-oauth2";

const keycloakClientId =
  localStorage.getItem("KEYCLOAK_CLIENT_ID") ||
  import.meta.env.VITE_KEYCLOAK_CLIENT_ID ||
  "oauth2-pkce-client";

const keycloak = new Keycloak({
  url: keycloakUrl,
  realm: keycloakRealm,
  clientId: keycloakClientId,
});

export const getKeycloakConfig = () => ({
  url: keycloakUrl,
  realm: keycloakRealm,
  clientId: keycloakClientId,
});

export default keycloak;

