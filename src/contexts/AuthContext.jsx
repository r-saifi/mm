import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const adminEmailsStr = import.meta.env.VITE_ADMIN_EMAILS;
    const adminEmails = adminEmailsStr ? adminEmailsStr.split(',').map(e => e.trim().toLowerCase()) : [];
    
    // 1. Authenticate with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Strict Whitelist Check (Case-Insensitive)
    if (!adminEmails.includes(user.email.toLowerCase())) {
      console.error('[Auth] Access Denied. Whitelist:', adminEmails, 'Attempted:', user.email);
      await signOut(auth);
      throw new Error('Access Denied: Your account does not have administrative privileges.');
    }
    
    return userCredential;
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const adminEmailsStr = import.meta.env.VITE_ADMIN_EMAILS;
      const adminEmails = adminEmailsStr ? adminEmailsStr.split(',').map(e => e.trim().toLowerCase()) : [];
      
      if (user && !adminEmails.includes(user.email.toLowerCase())) {
        // Force logout if an unauthorized user is somehow persisted or whitelist changed
        await signOut(auth);
        setCurrentUser(null);
      } else {
        setCurrentUser(user);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

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
