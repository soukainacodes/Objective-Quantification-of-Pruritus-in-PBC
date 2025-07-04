import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';

interface User {
  uid: string;
  email: string;
  role: 'doctor' | 'patient';
  name: string;
  surname: string;
}

interface AuthContextType {
  user: User | null;
  register: (name: string, surname: string, email: string, password: string, role: 'doctor' | 'patient') => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      try {
        setError(null);
        if (firebaseUser) {
          const role = localStorage.getItem(`user_role_${firebaseUser.uid}`) as 'doctor' | 'patient' || 'patient';
          const name = localStorage.getItem(`user_name_${firebaseUser.uid}`) || '';
          const surname = localStorage.getItem(`user_surname_${firebaseUser.uid}`) || '';
          
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            role,
            name,
            surname
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
        setError('Error loading user data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const register = async (name: string, surname: string, email: string, password: string, role: 'doctor' | 'patient') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      
      localStorage.setItem(`user_role_${userId}`, role);
      localStorage.setItem(`user_name_${userId}`, name);
      localStorage.setItem(`user_surname_${userId}`, surname);
      
      setUser({ uid: userId, email, role, name, surname });
      return { success: true };
    } catch (error: any) {
      let errorMessage = "An error occurred during registration.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Este correo electrónico ya está registrado.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "La contraseña debe tener al menos 6 caracteres.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "El correo electrónico no es válido.";
      }
      console.error("Error registering user:", error);
      return { success: false, error: errorMessage };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      const role = localStorage.getItem(`user_role_${userId}`) as 'doctor' | 'patient' || 'patient';
      const name = localStorage.getItem(`user_name_${userId}`) || '';
      const surname = localStorage.getItem(`user_surname_${userId}`) || '';
      
      setUser({
        uid: userId,
        email: userCredential.user.email || '',
        role,
        name,
        surname
      });
      return { success: true };
    } catch (error: any) {
      let errorMessage = "Error al iniciar sesión.";
      if (error.code === 'auth/user-not-found') {
        errorMessage = "El correo electrónico no existe.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "La contraseña es incorrecta.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Demasiados intentos fallidos. Por favor, intente más tarde.";
      }
      console.error("Error logging in:", error);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return ( 
    <AuthContext.Provider value={{ user, register, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
