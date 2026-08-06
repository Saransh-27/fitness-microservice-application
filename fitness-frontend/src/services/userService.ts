import api from "./api";
import type { UserResponse, UserUpdate } from "../types";
import { useDemoStore } from "../store/useDemoStore";
import { DEMO_USER } from "./demoData";
import { toast } from "sonner";

export const userService = {
  /** GET /apis/users/{id} */
  getUserById: async (id: string): Promise<UserResponse> => {
    try {
      const { data } = await api.get<UserResponse>(`/apis/users/${id}`);
      return data;
    } catch (error) {
      // Demo mode fallback
      if (useDemoStore.getState().isDemoMode) {
        console.log("[userService] Backend offline — returning demo user");
        return DEMO_USER;
      }
      throw error;
    }
  },

  /** GET /apis/users */
  getAllUsers: async (): Promise<UserResponse[]> => {
    try {
      const { data } = await api.get<UserResponse[]>("/apis/users");
      return data;
    } catch (error) {
      if (useDemoStore.getState().isDemoMode) {
        return [DEMO_USER];
      }
      throw error;
    }
  },

  /** PATCH /apis/users/update/{id} */
  updateUser: async (id: string, dto: UserUpdate): Promise<UserResponse> => {
    // Block mutating operations in demo mode
    if (useDemoStore.getState().isDemoMode) {
      toast.info("Profile updates are not available in demo mode.", {
        description: "This feature requires the backend microservices to be running.",
      });
      return { ...DEMO_USER, ...dto };
    }

    const { data } = await api.patch<UserResponse>(`/apis/users/update/${id}`, dto);
    return data;
  },

  /** DELETE /gateway/register/users/{id} */
  deleteUser: async (id: string): Promise<string> => {
    // Block mutating operations in demo mode
    if (useDemoStore.getState().isDemoMode) {
      toast.info("Account deletion is not available in demo mode.", {
        description: "This feature requires the backend microservices to be running.",
      });
      return "Demo mode — delete skipped";
    }

    const { data } = await api.delete<string>(`/gateway/register/users/${id}`);
    return data;
  },

  /** POST /apis/users/register */
  registerUser: async (dto: {
    username: string;
    email: string;
    password?: string;
    frontname?: string;
    lastname?: string;
    keycloakId?: string;
  }): Promise<UserResponse> => {
    const { data } = await api.post<UserResponse>("/apis/users/register", dto);
    return data;
  },

  /** GET /apis/users/{userId}/validate */
  validateUser: async (userId: string): Promise<boolean> => {
    try {
      const { data } = await api.get<boolean>(`/apis/users/${userId}/validate`);
      return data;
    } catch (error) {
      if (useDemoStore.getState().isDemoMode) {
        return true;
      }
      throw error;
    }
  },
};
