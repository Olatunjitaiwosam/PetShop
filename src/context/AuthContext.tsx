import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/superbase';
import { generateWallet, encryptKey } from '../lib/walletUtils';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  walletAddress: string | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthState: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Auto-create wallet for new users
  const ensureWallet = async (userId: string) => {
    const { data: existing } = await supabase
      .from('wallets')
      .select('wallet_address')
      .eq('user_id', userId)
      .single();

    if (existing) {
      setWalletAddress(existing.wallet_address);
      return;
    }

    // Generate new Solana wallet
    const { publicKey, privateKey } = generateWallet();
    const encrypted = encryptKey(privateKey, userId);

    const { error } = await supabase.from('wallets').insert({
      user_id: userId,
      wallet_address: publicKey,
      encrypted_private_key: encrypted,
    });

    if (!error) setWalletAddress(publicKey);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) ensureWallet(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) ensureWallet(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setWalletAddress(null);
  };

  return (
    <AuthContext.Provider value={{
      user, session, walletAddress, loading,
      signInWithGoogle, signInWithEmail, signUpWithEmail, signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthState');
  return ctx;
};