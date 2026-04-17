import React from 'react';
import { useAuth } from '../context/AuthContext';

const Footers: React.FC = () => {
  const { user } = useAuth();

  return (
    <footer className="bg-[#0f1f0f] text-white/60 mt-16">

      {/* Main */}
      <div className="w-full max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between gap-8">

        {/* Brand */}
        <div className="max-w-xs">
          <p className="text-green-400 text-lg font-medium mb-2">🐾 PawChain</p>
          <p className="text-white/40 text-xs leading-relaxed">
            A decentralized pet marketplace built on Solana Devnet. Pay for pets using SOL.
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-12 flex-wrap">
          <div>
            <p className="text-xs font-medium text-white/30 uppercase tracking-widest mb-3">Shop</p>
            <ul className="flex flex-col gap-2">
              {['All Pets', 'Dogs', 'Cats', 'Birds'].map(l => (
                <li key={l}>
                  <a href="#products" className="text-xs text-white/50 hover:text-green-400 transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium text-white/30 uppercase tracking-widest mb-3">Project</p>
            <ul className="flex flex-col gap-2">
              <li><a href="https://github.com/Olatunjitaiwosam/PetShop" target="_blank" rel="noreferrer" className="text-xs text-white/50 hover:text-green-400 transition-colors">GitHub</a></li>
              <li><a href="https://explorer.solana.com/?cluster=devnet" target="_blank" rel="noreferrer" className="text-xs text-white/50 hover:text-green-400 transition-colors">Solana Explorer</a></li>
            </ul>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="w-full max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-white/30 text-xs">
            © {new Date().getFullYear()} PawChain · CN6035 Hybrid DApp · Solana Devnet
          </span>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-xs text-green-400">
              {user ? `Signed in as ${user.email?.split('@')[0]}` : 'Solana Devnet Live'}
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footers;
