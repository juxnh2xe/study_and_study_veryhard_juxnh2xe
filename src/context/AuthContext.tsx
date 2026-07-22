'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { migrateLocalStorageToSupabase } from '@/lib/migration';
import { removeItem, STORAGE_KEYS } from '@/lib/storage';
import { UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isLoading: boolean;
  isConfigured: boolean;
  signUpWithEmail: (
    email: string,
    password: string,
    name: string,
    role?: UserRole,
    grade?: string
  ) => Promise<{ error: Error | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  signInWithProvider: (provider: 'google' | 'apple' | 'kakao') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(true);

  const isConfigured = isSupabaseConfigured();

  useEffect(() => {
    if (!isConfigured) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const savedRole = (session.user.user_metadata?.role as UserRole) || 'student';
        setUserRole(savedRole);
        migrateLocalStorageToSupabase(session.user.id);
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const savedRole = (session.user.user_metadata?.role as UserRole) || 'student';
        setUserRole(savedRole);
        migrateLocalStorageToSupabase(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [isConfigured]);

  const signUpWithEmail = async (
    email: string,
    password: string,
    name: string,
    role: UserRole = 'student',
    grade: string = '3'
  ) => {
    if (!isConfigured) {
      return { error: new Error('Supabase project configuration is missing.') };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role, grade },
      },
    });

    if (data.user) {
      setUserRole(role);
      // Upsert profile with role
      await supabase.from('profiles').upsert({
        id: data.user.id,
        name,
        role,
        grade,
        created_at: new Date().toISOString(),
      });
      await migrateLocalStorageToSupabase(data.user.id);
    }

    return { error };
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!isConfigured) {
      return { error: new Error('Supabase project configuration is missing.') };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data.user) {
      const savedRole = (data.user.user_metadata?.role as UserRole) || 'student';
      setUserRole(savedRole);
      await migrateLocalStorageToSupabase(data.user.id);
    }

    return { error };
  };

  const signOut = async () => {
    // Clear all LocalStorage session caches on signout to guarantee clean multi-user isolation
    Object.values(STORAGE_KEYS).forEach((key) => {
      removeItem(key);
    });

    if (isConfigured) {
      await supabase.auth.signOut();
    }

    setUser(null);
    setSession(null);
    setUserRole('student');
    window.location.reload();
  };

  const signInWithProvider = async (provider: 'google' | 'apple' | 'kakao') => {
    if (!isConfigured) return;
    await supabase.auth.signInWithOAuth({
      provider: provider === 'kakao' ? ('kakao' as any) : provider,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userRole,
        setUserRole,
        isLoading,
        isConfigured,
        signUpWithEmail,
        signInWithEmail,
        signOut,
        signInWithProvider,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
