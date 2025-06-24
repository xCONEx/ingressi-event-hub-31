
import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('ingrezzi_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('ingrezzi_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - will be replaced with Supabase auth later
    console.log('Login attempt:', { email, password });
    const mockUser = {
      id: '1',
      email: email,
      name: email.split('@')[0]
    };
    setUser(mockUser);
    localStorage.setItem('ingrezzi_user', JSON.stringify(mockUser));
  };

  const register = async (email: string, password: string, name?: string) => {
    // Mock registration - will be replaced with Supabase auth later
    console.log('Register attempt:', { email, password, name });
    const mockUser = {
      id: '1',
      email: email,
      name: name || email.split('@')[0]
    };
    setUser(mockUser);
    localStorage.setItem('ingrezzi_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ingrezzi_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
