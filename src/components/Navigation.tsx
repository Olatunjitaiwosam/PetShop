import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export function Navigation() {
  const { user, walletAddress, signOut } = useAuth();
  const { connection } = useConnection();
  const [showModal, setShowModal] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);

  // Get email initials
  const getInitials = (email: string) => {
    const parts = email.split('@')[0].split(/[._-]/);
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  };

  // Fetch SOL balance
  useEffect(() => {
    if (!walletAddress) { setBalance(null); return; }

    const fetchBalance = async () => {
      try {
        const pubkey = new PublicKey(walletAddress);
        const lamports = await connection.getBalance(pubkey);
        setBalance(lamports / LAMPORTS_PER_SOL);
      } catch {
        setBalance(null);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [walletAddress, connection]);

  return (
    <>
      <nav className='h-[60px] fixed w-full flex z-30 items-center border-b border-white/10 px-5 bg-[#0f1f0f] text-white'>
        <div className="w-full max-w-5xl mx-auto flex justify-between items-center">
          <span className='font-bold text-green-400'>🐾 PawChain</span>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* SOL Balance */}
                {balance !== null && (
                  <span className="text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1 rounded-full">
                    ◎ {balance.toFixed(3)} SOL
                  </span>
                )}

                {/* Wallet address */}
                <span className="text-xs text-white/50 bg-white/10 px-3 py-1 rounded-full font-mono hidden sm:block">
                  {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                </span>

                {/* Email initials avatar */}
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-xs font-medium text-white">
                  {user.email ? getInitials(user.email) : '??'}
                </div>

                {/* Email (hidden on mobile) */}
                <span className="text-xs text-white/50 hidden md:block">
                  {user.email?.split('@')[0]}
                </span>

                <button
                  onClick={signOut}
                  className="flex items-center justify-center gap-2 py-2 rounded-lg border border-red-500/20 hover:bg-red-500/10 transition-colors text-red-400 hover:text-red-300 text-xs"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Sign out
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="bg-green-500 hover:bg-green-600 text-white text-sm px-5 py-2 rounded-full transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </>
  );
}