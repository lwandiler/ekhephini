
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string, redirectTo?: string) => Promise<void>;
  signIn: (email: string, password: string, redirectTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up the auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          toast.success('Welcome back!', {
            description: 'You have successfully signed in.'
          });
        } else if (event === 'SIGNED_OUT') {
          toast.success('Signed out', {
            description: 'You have been signed out.'
          });
        }
      }
    );

    // Get the initial session
    const fetchInitialSession = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setLoading(false);
    };

    fetchInitialSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Sign up with email and password
  const signUp = async (email: string, password: string, username: string, redirectTo = '/') => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
          emailRedirectTo: window.location.origin + redirectTo,
        },
      });

      if (error) throw error;
      
      toast.success('Account created!', {
        description: 'Please check your email to verify your account.'
      });
    } catch (error: any) {
      toast.error('Sign up failed', {
        description: error.message || 'An error occurred during sign up.'
      });
      console.error('Sign up error:', error);
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string, redirectTo = '/') => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error('Sign in failed', {
        description: error.message || 'Invalid email or password.'
      });
      console.error('Sign in error:', error);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error: any) {
      toast.error('Sign out failed', {
        description: error.message || 'An error occurred during sign out.'
      });
      console.error('Sign out error:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
