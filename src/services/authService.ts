import { apiClient, ApiResponse } from './api';
import { User } from '@/types/client';

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface VerifyEmailRequest {
  token: string;
}

// API endpoints for authentication
const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/auth/signup',
  LOGOUT: '/api/auth/logout',
  VERIFY_EMAIL: '/api/auth/verify-email',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',
  ME: '/api/auth/me',
  UPDATE_PROFILE: '/api/auth/profile',
};

export const authService = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
    if (response.data?.token) {
      apiClient.setToken(response.data.token);
    }
    return response;
  },

  /**
   * Register a new user
   */
  async signup(data: SignupRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(AUTH_ENDPOINTS.SIGNUP, data);
  },

  /**
   * Logout current user
   */
  async logout(): Promise<ApiResponse<void>> {
    const response = await apiClient.post<void>(AUTH_ENDPOINTS.LOGOUT, {});
    apiClient.setToken(null);
    return response;
  },

  /**
   * Verify email with token
   */
  async verifyEmail(data: VerifyEmailRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post(AUTH_ENDPOINTS.VERIFY_EMAIL, data);
  },

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, { token, newPassword });
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get(AUTH_ENDPOINTS.ME);
  },

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.patch(AUTH_ENDPOINTS.UPDATE_PROFILE, updates);
  },

  /**
   * Set authentication token (for restoring session)
   */
  setToken(token: string | null) {
    apiClient.setToken(token);
  },
};
