
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  phone?: string;
  cpf?: string;
  plan_type?: string;
  person_type?: 'fisica' | 'juridica';
  complete_profile?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateProfile: (data: Partial<User>) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return null;
      }

      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const checkCompleteProfile = (profile: any, sessionUser: any) => {
    const hasName = profile?.name || sessionUser?.user_metadata?.name || sessionUser?.user_metadata?.full_name;
    const hasCpf = profile?.cpf;
    const hasPhone = profile?.phone;
    const hasPersonType = profile?.person_type;
    
    return !!(hasName && hasCpf && hasPhone && hasPersonType);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          const completeProfile = checkCompleteProfile(profile, session.user);
          
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: profile?.name || session.user.user_metadata?.name || session.user.user_metadata?.full_name,
            avatar_url: profile?.avatar_url || session.user.user_metadata?.avatar_url,
            phone: profile?.phone,
            cpf: profile?.cpf,
            plan_type: profile?.plan_type,
            person_type: profile?.person_type,
            complete_profile: completeProfile
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        const completeProfile = checkCompleteProfile(profile, session.user);
        
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: profile?.name || session.user.user_metadata?.name || session.user.user_metadata?.full_name,
          avatar_url: profile?.avatar_url || session.user.user_metadata?.avatar_url,
          phone: profile?.phone,
          cpf: profile?.cpf,
          plan_type: profile?.plan_type,
          person_type: profile?.person_type,
          complete_profile: completeProfile
        });
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    if (error) throw error;
  };

  const register = async (email: string, password: string, name?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name: name,
          full_name: name
        }
      }
    });
    if (error) throw error;
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        name: data.name || user.name,
        phone: data.phone || user.phone,
        cpf: data.cpf || user.cpf,
        avatar_url: data.avatar_url || user.avatar_url,
        person_type: data.person_type || user.person_type,
      });

    if (error) throw error;

    const updatedUser = { ...user, ...data };
    const completeProfile = checkCompleteProfile(updatedUser, null);
    
    setUser({ ...updatedUser, complete_profile: completeProfile });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateProfile, loginWithGoogle }}>
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
