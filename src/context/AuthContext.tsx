import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { LoginModel } from '../models/LoginModel';
import autenticationService from '../services/autenticationService';

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

  // Verifica se há uma sessão ativa ao carregar o componente
  useEffect(() => {
    autenticationService.getCurrentUser()
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
      const response = await autenticationService.login({ email, password });
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
      await autenticationService.logout();
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
