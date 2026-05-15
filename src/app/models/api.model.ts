// Risposta standard dell'API (come definito nel backend)
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: Date;
}

// Auth Response
export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  name: string;
  role: string;
}

// Login Request
export interface LoginRequest {
  email: string;
  password: string;
}

// Register Request
export interface RegisterRequest {
  name: string;
  surname: string;
  email: string;
  password: string;
  phone?: string;
  birthDate?: string;
}

// User DTO
export interface UserDTO {
  id: number;
  email: string;
  name: string;
  surname?: string;
  phone?: string;
  birthDate?: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  createdAt: Date;
}

// Change Password Request
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
