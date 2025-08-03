const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
  };
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
  requiresEmailVerification?: boolean;
  userEmail?: string;
}

class ApiService {
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private static async makeRequest<T>(url: string, options: RequestInit, retryOnTokenRefresh = true): Promise<T> {
    try {
      const response = await fetch(url, options);
      return await this.handleResponse<T>(response);
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error - please check your internet connection');
      }
      
      // If token was refreshed, retry the request once
      if (retryOnTokenRefresh && error instanceof Error && error.message === 'Token refreshed - retry needed') {
        // Update the authorization header with new token
        const newToken = localStorage.getItem('accessToken');
        if (newToken && options.headers) {
          // Ensure headers is mutable
          const mutableHeaders = { ...options.headers } as Record<string, string>;
          mutableHeaders['Authorization'] = `Bearer ${newToken}`;
          options.headers = mutableHeaders;
        }
        
        try {
          const retryResponse = await fetch(url, options);
          return await this.handleResponse<T>(retryResponse);
        } catch {
          // If retry fails, clear auth data and throw original error
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          localStorage.removeItem('isAuthenticated');
          throw new Error('Authentication failed - please log in again');
        }
      }
      throw error;
    }
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    let data;
    try {
      data = await response.json();
    } catch {
      // Handle cases where response is not valid JSON
      throw new Error('Invalid response from server - please try again');
    }
    
    // If token is expired or out of sync, try to refresh it
    if (response.status === 401 && data.message && (data.message.includes('token') || data.code === 'TOKEN_SYNC_REQUIRED')) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const refreshResponse = await fetch(`${API_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
          });
          
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            if (refreshData.success && refreshData.tokens) {
              localStorage.setItem('accessToken', refreshData.tokens.accessToken);
              localStorage.setItem('refreshToken', refreshData.tokens.refreshToken);
              
              // Update user data if available in refresh response
              if (refreshData.user) {
                localStorage.setItem('user', JSON.stringify(refreshData.user));
                localStorage.setItem('isAuthenticated', 'true');
              }
              
              // Don't retry here - let the caller handle the retry with new token
              throw new Error('Token refreshed - retry needed');
            }
          } else {
            // If refresh fails, clear all auth data
            throw new Error('Token refresh failed');
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Clear auth data and redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          localStorage.removeItem('isAuthenticated');
          
          if (refreshError instanceof Error && refreshError.message === 'Token refreshed - retry needed') {
            throw refreshError; // Re-throw the retry signal
          }
          
          throw new Error('Authentication failed - please log in again');
        }
      } else {
        // No refresh token available, clear auth data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        throw new Error('Authentication failed - please log in again');
      }
    }
    
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }
    
    return data;
  }

  // Authentication APIs
  static async sendVerificationEmail(email: string): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>(`${API_URL}/auth/send-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    }, false); // Don't retry on token refresh for verification emails
  }

  static async resendVerificationEmail(email: string): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>(`${API_URL}/auth/resend-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    }, false); // Don't retry on token refresh for verification emails
  }

  // Step 2: Verify email token
  static async verifyEmailToken(token: string): Promise<ApiResponse<{ email: string; token: string; expiresAt?: string }>> {
    return this.makeRequest<ApiResponse<{ email: string; token: string; expiresAt?: string }>>(`${API_URL}/auth/verify-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    }, false);
  }

  // Step 3: Complete registration
  static async completeRegistration(data: {
    token: string;
    username: string;
    password: string;
    role?: string;
  }): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>(`${API_URL}/auth/complete-registration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, false);
  }

  static async register(userData: {
    username: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }, false); // Don't retry on token refresh for registration
  }

  static async login(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    }, false); // Don't retry on token refresh for login
  }

  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    }, false); // Don't retry on token refresh for refresh token
  }

  static async logout(refreshToken?: string): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ refreshToken })
    });
  }

  static async requestPasswordReset(email: string): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>(`${API_URL}/auth/request-password-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    }, false); // Don't retry on token refresh for password reset
  }

  static async resetPassword(token: string, newPassword: string): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    }, false); // Don't retry on token refresh for password reset
  }

  static async getProfile(): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>(`${API_URL}/auth/profile`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
  }
}

export default ApiService;
