import { useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import {
  SystemProgram, Transaction, PublicKey,
  LAMPORTS_PER_SOL, Keypair, sendAndConfirmTransaction
} from '@solana/web3.js';
import { supabase } from '../lib/superbase';
import { useAuth } from '../context/AuthContext';
import { IProduct } from '../models';
import { decryptKey } from '../lib/walletUtils';
import bs58 from 'bs58';

export const useCheckout = () => {
  const { connection } = useConnection();
  const { user, walletAddress } = useAuth();
  const [loading, setLoading] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const buyNow = async (product: IProduct) => {
    if (!user) { setError('Please sign in first.'); return; }
    console.log('Store wallet:', process.env.REACT_APP_STORE_WALLET);


    const storeWalletAddress = process.env.REACT_APP_STORE_WALLET;
    if (!storeWalletAddress) { setError('Store wallet not configured.'); return; }

    let STORE_WALLET: PublicKey;
    try {
      STORE_WALLET = new PublicKey(storeWalletAddress);
    } catch {
      setError('Invalid store wallet address.'); return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 1. Fetch encrypted private key from Supabase
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('encrypted_private_key, wallet_address')
        .eq('user_id', user.id)
        .single();

      if (walletError || !walletData) throw new Error('Wallet not found.');

      // 2. Decrypt private key
      const privateKey = decryptKey(walletData.encrypted_private_key, user.id);
      const secretKey = bs58.decode(privateKey);
      const keypair = Keypair.fromSecretKey(secretKey);

      // 3. Build transaction
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: keypair.publicKey,
          toPubkey: STORE_WALLET,
          lamports: Math.round(product.price * LAMPORTS_PER_SOL),
        })
      );

      // 4. Sign and send using custodial keypair
      const sig = await sendAndConfirmTransaction(connection, tx, [keypair]);
      setTxSignature(sig);

      // 5. Save order to Supabase
      const { error: dbError } = await supabase.from('orders').insert({
        user_id: user.id,
        wallet_address: walletData.wallet_address,
        product_id: product.id,
        product_title: product.title,
        amount_sol: product.price,
        tx_signature: sig,
        status: 'confirmed',
      });

      if (dbError) throw new Error(dbError.message);

      setSuccess(true);
      return sig;

    } catch (err: any) {
      setError(err.message || 'Transaction failed.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setTxSignature(null);
    setError(null);
    setSuccess(false);
  };

  return { buyNow, loading, txSignature, error, success, reset };
};