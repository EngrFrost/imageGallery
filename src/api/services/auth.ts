import api from '../api';
import type { LoginCredentials, SignupCredentials } from '../../types/auth';

export const login = async (credentials: LoginCredentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const signup = async (credentials: SignupCredentials) => {
  const response = await api.post('/auth/signup', credentials);
  return response.data;
};
