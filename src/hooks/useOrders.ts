import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/superbase';

export interface Order {
  id: string;
  product_id: string;
  product_title: string;
  amount_sol: number;
  tx_signature: string;
  status: string;
  wallet_address: string;
  created_at: string;
}

export const useOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { setOrders([]); return; }

    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) setError(error.message);
      else setOrders(data || []);
      setLoading(false);
    };

    fetch();
  }, [user]);

  return { orders, loading, error };
};