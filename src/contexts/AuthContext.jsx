import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, supabaseReady } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    if (!supabaseReady) {
      throw new Error('Supabase is not configured.');
    }

    const adminEmailsStr = import.meta.env.VITE_ADMIN_EMAILS;
    const adminEmails = adminEmailsStr ? adminEmailsStr.split(',').map(e => e.trim().toLowerCase()) : [];
    
    // 1. Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    const user = data.user;

    // 2. Strict Whitelist Check (Case-Insensitive)
    if (user && user.email && !adminEmails.includes(user.email.toLowerCase())) {
      console.error('[Auth] Access Denied. Whitelist:', adminEmails, 'Attempted:', user.email);
      await supabase.auth.signOut();
      throw new Error('Access Denied: Your account does not have administrative privileges.');
    }
    
    return data;
  };

  const logout = async () => {
    if (supabaseReady) {
      await supabase.auth.signOut();
    }
  };

  useEffect(() => {
    if (!supabaseReady) {
      setLoading(false);
      return;
    }

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleUser(session?.user || null);
      setLoading(false);
    });

    // Subscribing to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleUser = async (user) => {
    const adminEmailsStr = import.meta.env.VITE_ADMIN_EMAILS;
    const adminEmails = adminEmailsStr ? adminEmailsStr.split(',').map(e => e.trim().toLowerCase()) : [];
    
    if (user && user.email && !adminEmails.includes(user.email.toLowerCase())) {
      // Force logout if an unauthorized user is somehow persisted
      await supabase.auth.signOut();
      setCurrentUser(null);
    } else {
      setCurrentUser(user);
    }
  };

  const value = { currentUser, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
