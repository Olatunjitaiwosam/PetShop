import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

export function Navigation() {
  const { user, walletAddress, signOut } = useAuth();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <nav className='h-[60px] w-full flex items-center border-b border-white/10 px-5 bg-[#0f1f0f] text-white'>
        <div className="w-full max-w-5xl mx-auto flex justify-between items-center">
          <span className='font-bold text-green-400'>🐾 PawChain</span>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Wallet badge */}
                <span className="text-xs text-white/50 bg-white/10 px-3 py-1 rounded-full font-mono">
                  {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                </span>
                <button
                  onClick={signOut}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Sign Out
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