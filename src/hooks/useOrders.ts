import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from '../lib/superbase';

export interface Order {
  id: string;
  pet_name: string;
  pet_icon: string;
  amount_sol: number;
  tx_signature: string;
  status: string;
  created_at: string;
}

export const useOrders = () => {
  const { publicKey, connected } = useWallet();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!connected || !publicKey) { setOrders([]); return; }

    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('wallet_address', publicKey.toBase58())
        .order('created_at', { ascending: false });

      if (!error && data) setOrders(data);
      setLoading(false);
    };

    fetchOrders();
  }, [connected, publicKey]);

  return { orders, loading };
};