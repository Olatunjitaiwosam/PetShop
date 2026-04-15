import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/superbase';

export const useAdmin = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Wait for auth to finish loading first
    if (authLoading) return;

    if (!user) {
      setIsAdmin(false);
      setChecking(false);
      return;
    }

    const checkAdmin = async () => {
      setChecking(true);
      try {
        const { data, error } = await supabase
          .from('admins')
          .select('id')
          .eq('user_id', user.id)
          .single();

        console.log('Admin check result:', { data, error, userId: user.id });
        setIsAdmin(!!data && !error);
      } catch (err) {
        console.error('Admin check failed:', err);
        setIsAdmin(false);
      } finally {
        setChecking(false);
      }
    };

    checkAdmin();
  }, [user, authLoading]);

  return { isAdmin, checking };
};