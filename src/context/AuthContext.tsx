// src/context/AuthContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api from '../api';
import { LoginModel } from '../models/LoginModel';

type AuthContextType = {
  isAuthenticated: boolean;
  login: (data: LoginModel) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Verifica se há uma sessão ativa ao carregar o componente
  useEffect(() => {
    api.get('/me')
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  const login = async ({ email, password }: LoginModel) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.status === 200) {
        // O backend deve definir o cookie HTTP-only com o token
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser utilizado dentro do AuthProvider');
  }
  return context;
};
