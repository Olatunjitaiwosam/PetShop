import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from '../lib/superbase';

export const useWalletAuth = () => {
  const { publicKey, connected } = useWallet();

  useEffect(() => {
    if (!connected || !publicKey) return;

    const registerWallet = async () => {
      const address = publicKey.toBase58();

      // Upsert — creates user if not exists, ignores if already exists
      const { error } = await supabase
        .from('users')
        .upsert({ wallet_address: address }, { onConflict: 'wallet_address' });

      if (error) console.error('Wallet register error:', error.message);
      else console.log('Wallet registered:', address);
    };

    registerWallet();
  }, [connected, publicKey]);
};