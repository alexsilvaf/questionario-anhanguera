import http from './http';
import { LoginModel } from '../models/LoginModel';
import { RegisterModel } from '../models/RegisterModel';

export const login = (data: LoginModel) => {
    return http.post('/auth/login', data);
};

export const register = (data: RegisterModel) => {
    return http.post('/user/register', data);
};

export const logout = () => {
    return http.post('/auth/logout');
};

export const getCurrentUser = () => {
    return http.get('auth/me');
};

const autenticationService = {
    login,
    register,
    logout,
    getCurrentUser,
  };
  
  export default autenticationService;