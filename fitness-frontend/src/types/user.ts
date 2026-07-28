// ============================================================
// User Types — maps to backend UserRequestDto, UserResponseDto, UserUpdateDto
// ============================================================

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface UserRequest {
  keycloakId: string;
  username: string;
  password: string;
  role?: UserRole;
  email: string;
  frontname: string;
  lastname: string;
}

export interface UserResponse {
  id: string;
  keycloakId: string;
  username: string;
  password: string;
  role: UserRole;
  email: string;
  frontname: string;
  lastname: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserUpdate {
  username?: string;
  password?: string;
  email?: string;
  frontname?: string;
  lastname?: string;
}
