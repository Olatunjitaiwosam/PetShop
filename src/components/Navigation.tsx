import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Link } from 'react-router-dom';

export function Navigation() {
  const { user, walletAddress, signOut } = useAuth();
  const [copied, setCopied] = useState(false);
  const { connection } = useConnection();
  const [showModal, setShowModal] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);

  const getInitials = (email: string) => {
    const parts = email.split('@')[0].split(/[._-]/);
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  };

  useEffect(() => {
    if (!walletAddress) { setBalance(null); return; }
    const fetchBalance = async () => {
      try {
        const pubkey = new PublicKey(walletAddress);
        const lamports = await connection.getBalance(pubkey);
        setBalance(lamports / LAMPORTS_PER_SOL);
      } catch { setBalance(null); }
    };
    fetchBalance();
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, [walletAddress, connection]);

  // Close drawer on outside click
  useEffect(() => {
    if (!showDrawer) return;
    const handler = () => setShowDrawer(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [showDrawer]);

  const copyWalletAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback for non-HTTPS
      const el = document.createElement('textarea');
      el.value = walletAddress;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <nav className='h-[60px] fixed w-full flex z-30 items-center border-b border-white/10 px-5 bg-[#0f1f0f] text-white'>
        <div className="w-full max-w-5xl mx-auto flex justify-between items-center">

          {/* Left — hamburger + logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-1"
              onClick={e => { e.stopPropagation(); setShowDrawer(prev => !prev); }}
            >
              <span className={`block w-5 h-0.5 bg-white/70 transition-all duration-200 ${showDrawer ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white/70 transition-all duration-200 ${showDrawer ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white/70 transition-all duration-200 ${showDrawer ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>

            <span className='font-bold text-green-400'>
              🐾 <Link to="/">PawChain</Link>
            </span>
          </div>

          {/* Right — desktop nav + auth */}
          <div className="flex items-center gap-3">

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-4 mr-2">
              {user && (
                <Link to="/orders" className="text-xs text-white/60 hover:text-white transition-colors">My Orders</Link>
              )}
            </div>

            {user ? (
              <>
                {balance !== null && (
                  <span className="text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1 rounded-full">
                    ◎ {balance.toFixed(3)} SOL
                  </span>
                )}

                {/* Copy wallet address button */}
                <button
                  type="button"
                  onClick={copyWalletAddress}
                  className="text-sm text-white/50 bg-white/10 px-3 py-1 rounded-full font-mono hidden sm:flex items-center gap-1.5 cursor-pointer hover:bg-white/20 transition-colors"
                  title="Copy wallet address"
                >
                  {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                  {copied ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  )}
                </button>

                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-xs font-medium text-white">
                  {user.email ? getInitials(user.email) : '??'}
                </div>

                <span className="text-xs text-white/50 hidden md:block">
                  {user.email?.split('@')[0]}
                </span>

                <button
                  onClick={signOut}
                  className="hidden md:flex items-center gap-2 py-2 px-3 rounded-lg border border-red-500/20 hover:bg-red-500/10 transition-colors text-red-400 hover:text-red-300 text-xs"
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
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile bottom drawer */}
      <div
        className={`fixed inset-0 z-20 transition-all duration-300 md:hidden ${showDrawer ? 'visible' : 'invisible'}`}
        onClick={() => setShowDrawer(false)}
      >
        {/* Backdrop */}
        <div className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${showDrawer ? 'opacity-100' : 'opacity-0'}`} />

        {/* Drawer — slides from bottom */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-[#0f1f0f] rounded-t-3xl transition-transform duration-300 ${showDrawer ? 'translate-y-0' : 'translate-y-full'}`}
          style={{ height: '30vh' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-4">
            <div className="w-10 h-1 bg-white/20 rounded-full" />
          </div>

          {/* Drawer content */}
          <div className="px-6 flex flex-col gap-1">

            {user ? (
              <div className="flex items-center gap-3 pb-4 mb-2 border-b border-white/10">
                <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-sm font-medium text-white">
                  {user.email ? getInitials(user.email) : '??'}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{user.email?.split('@')[0]}</p>
                  <button
                    type="button"
                    onClick={copyWalletAddress}
                    className="text-white/40 text-xs font-mono flex items-center gap-1 hover:text-white/70 transition-colors"
                  >
                    {walletAddress?.slice(0, 8)}...{walletAddress?.slice(-4)}
                    {copied ? (
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                        <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    )}
                  </button>
                </div>
                {balance !== null && (
                  <span className="ml-auto text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-2.5 py-1 rounded-full">
                    ◎ {balance.toFixed(3)}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 pb-4 mb-2 border-b border-white/10">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-lg">
                  🔒
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Not signed in</p>
                  <p className="text-white/40 text-xs">Sign in to access your wallet</p>
                </div>
                <button
                  onClick={() => { setShowModal(true); setShowDrawer(false); }}
                  className="ml-auto bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Sign In
                </button>
              </div>
            )}

            <Link
              to="/"
              onClick={() => setShowDrawer(false)}
              className="flex items-center gap-3 text-white/70 hover:text-white py-2.5 text-sm transition-colors"
            >
              🐾 Home
            </Link>

            {user && (
              <Link
                to="/orders"
                onClick={() => setShowDrawer(false)}
                className="flex items-center gap-3 text-white/70 hover:text-white py-2.5 text-sm transition-colors"
              >
                🛍️ My Orders
              </Link>
            )}

            {user && (
              <button
                onClick={() => { signOut(); setShowDrawer(false); }}
                className="flex items-center gap-3 text-red-400 hover:text-red-300 py-2.5 text-sm transition-colors mt-1"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Sign Out
              </button>
            )}

          </div>
        </div>
      </div>

      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </>
  );
}