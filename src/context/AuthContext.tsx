import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { LoginModel } from '../models/LoginModel';
import authenticationService from '../services/authenticationService';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginModel) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    authenticationService.getCurrentUser()
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async ({ email, password }: LoginModel) => {
    try {
      const response = await authenticationService.login({ email, password });
      if (response.status === 200) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authenticationService.logout();
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
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
