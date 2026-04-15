import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { supabase } from '../lib/superbase';

const STORE_WALLET = new PublicKey(process.env.REACT_APP_STORE_WALLET!);

interface Pet {
  name: string;
  icon: string;
  price: number; // in SOL
}

export const useCheckout = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkout = async (pet: Pet) => {
    if (!publicKey) {
      setError('Please connect your wallet first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Build transaction
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: STORE_WALLET,
          lamports: pet.price * LAMPORTS_PER_SOL,
        })
      );

      // 2. Send to Solana Devnet
      const sig = await sendTransaction(tx, connection);

      // 3. Wait for confirmation
      await connection.confirmTransaction(sig, 'confirmed');
      setTxSignature(sig);

      // 4. Save order to Supabase
      const { error: dbError } = await supabase.from('orders').insert({
        wallet_address: publicKey.toBase58(),
        pet_name: pet.name,
        pet_icon: pet.icon,
        amount_sol: pet.price,
        tx_signature: sig,
        status: 'confirmed',
      });

      if (dbError) throw new Error(dbError.message);

      return sig;
    } catch (err: any) {
      setError(err.message || 'Transaction failed.');
    } finally {
      setLoading(false);
    }
  };

  return { checkout, loading, txSignature, error };
};