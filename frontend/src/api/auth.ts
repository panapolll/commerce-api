import axios from 'axios';
import { AUTH_API_URL } from './config';

interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}

export const login = async (email: string, password: string) => {
  const response = await axios.post<LoginResponse>(`${AUTH_API_URL}/auth/login`, {
    email,
    password,
  });
  return response.data;
};

export const register = async (email: string, password: string) => {
  const response = await axios.post(`${AUTH_API_URL}/auth/register`, {
    email,
    password,
  });
  return response.data;
};

export const refreshToken = async (userId: string, refreshTokenValue: string) => {
  const response = await axios.post<RefreshResponse>(`${AUTH_API_URL}/auth/refresh`, {
    userId,
    refreshToken: refreshTokenValue,
  });
  return response.data;
};

export const getUserIdFromToken = (token: string): string | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub ?? null;
  } catch {
    return null;
  }
};
