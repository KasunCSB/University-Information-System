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
}

class ApiService {
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }
    
    return data;
  }

  // Authentication APIs
  static async register(userData: {
    username: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    return this.handleResponse<AuthResponse>(response);
  }

  static async login(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    return this.handleResponse<AuthResponse>(response);
  }

  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    
    return this.handleResponse<AuthResponse>(response);
  }

  static async logout(refreshToken?: string): Promise<ApiResponse> {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ refreshToken })
    });
    
    return this.handleResponse<ApiResponse>(response);
  }

  static async verifyEmail(token: string): Promise<ApiResponse> {
    const response = await fetch(`${API_URL}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    
    return this.handleResponse<ApiResponse>(response);
  }

  static async requestPasswordReset(email: string): Promise<ApiResponse> {
    const response = await fetch(`${API_URL}/auth/request-password-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    return this.handleResponse<ApiResponse>(response);
  }

  static async resetPassword(token: string, newPassword: string): Promise<ApiResponse> {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    });
    
    return this.handleResponse<ApiResponse>(response);
  }

  static async getProfile(): Promise<ApiResponse> {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse<ApiResponse>(response);
  }
}

export default ApiService;
