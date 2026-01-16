
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { calculateCosmicScores } from '@/utils/calculateCosmicScores';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // Explicit alias for clarity if needed, but 'user' is standard
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 1. Check active session on mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        await fetchUserRecord(session.user.id);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
      setLoading(false);
    };

    checkSession();

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        await fetchUserRecord(session.user.id);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserRecord = async (userId) => {
    try {
      // Fetch all columns including 'role'
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user record:', error);
      } else {
        setCurrentUser(data); // This holds the DB record including 'role'
      }
    } catch (err) {
      console.error("Exception fetching user record", err);
    }
  };

  const signup = async (email, password, name, birthDate) => {
    try {
      // 1. Create Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            birth_date: birthDate
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Calculate Initial Scores
        const scores = calculateCosmicScores(birthDate, name);
        
        // 3. Create User Record in public table
        const { error: dbError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email: email,
              full_name: name,
              birth_date: birthDate,
              psychological_score: scores?.psychologicalScore || 50,
              systemic_score: scores?.systemicScore || 50,
              role: 'user' // Default role for new signups
            }
          ]);
        
        if (dbError) {
          console.error("Error creating public user record:", dbError);
          // Non-critical if auth succeeded, but ideal to handle rollback in production
        }
      }

      return { success: true, user: authData.user };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { success: true, user: data.user };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setCurrentUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: error.message };
    }
  };

  const updateUserProfile = async (updates) => {
    console.log("Update profile requested (stub)", updates);
    // Real implementation would update supabase 'users' table or 'profiles' table
  };
  
  const updateSubscription = () => {};
  const addLike = () => {};

  const value = {
    user, // Auth User object
    currentUser, // DB User record (includes role)
    loading,
    isAuthenticated,
    signup,
    login,
    logout,
    updateUserProfile,
    updateSubscription,
    addLike
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
