import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/superbase';

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }

    const checkAdmin = async () => {
      const { data } = await supabase
        .from('users')
        .select('is_admin')
        .eq('wallet_address', user.id)
        .single();

      setIsAdmin(data?.is_admin ?? false);
    };

    checkAdmin();
  }, [user]);

  return { isAdmin };
};