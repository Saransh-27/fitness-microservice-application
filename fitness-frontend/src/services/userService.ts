import api from "./api";
import type { UserResponse, UserUpdate } from "../types";

export const userService = {
  /** GET /apis/users/{id} */
  getUserById: async (id: string): Promise<UserResponse> => {
    const { data } = await api.get<UserResponse>(`/apis/users/${id}`);
    return data;
  },

  /** GET /apis/users */
  getAllUsers: async (): Promise<UserResponse[]> => {
    const { data } = await api.get<UserResponse[]>("/apis/users");
    return data;
  },

  /** PATCH /apis/users/update/{id} */
  updateUser: async (id: string, dto: UserUpdate): Promise<UserResponse> => {
    const { data } = await api.patch<UserResponse>(`/apis/users/update/${id}`, dto);
    return data;
  },

  /** DELETE /gateway/register/users/{id} */
  deleteUser: async (id: string): Promise<string> => {
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
    const { data } = await api.get<boolean>(`/apis/users/${userId}/validate`);
    return data;
  },
};
