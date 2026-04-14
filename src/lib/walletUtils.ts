import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { PublicKey } from '@solana/web3.js';

export const generateWallet = () => {
  const keypair = nacl.sign.keyPair();
  const publicKey = new PublicKey(keypair.publicKey).toBase58();
  const privateKey = bs58.encode(keypair.secretKey);
  return { publicKey, privateKey };
};

export const encryptKey = (privateKey: string, secret: string): string => {
  return btoa(`${secret}:${privateKey}`); // basic encoding for student project
};

export const decryptKey = (encrypted: string, secret: string): string => {
  const decoded = atob(encrypted);
  return decoded.replace(`${secret}:`, '');
};