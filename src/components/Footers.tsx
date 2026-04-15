import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const columns: FooterColumn[] = [
  {
    title: 'Shop',
    links: [
      { label: 'All Pets', href: '#products' },
      { label: 'Dogs', href: '#' },
      { label: 'Cats', href: '#' },
      { label: 'Birds', href: '#' },
      { label: 'Small Pets', href: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'How it works', href: '#' },
      { label: 'Wallet setup', href: '#' },
      { label: 'FAQ', href: '#' },
      { label: 'Contact us', href: '#' },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'GitHub', href: 'https://github.com/YOUR_USERNAME/PetShop' },
      { label: 'Installation guide', href: '#' },
      { label: 'Solana Explorer', href: 'https://explorer.solana.com/?cluster=devnet' },
      { label: 'About', href: '#' },
    ],
  },
];

const Footers: React.FC = () => {
  const { connected } = useWallet();

  return (
    <footer className="bg-[#0f1f0f] text-white/75 text-sm px-12 pt-12 pb-6 mt-16">

      <div className="grid grid-cols-4 w-full max-w-5xl mx-auto gap-8 mb-10">

        {/* Brand */}
        <div>
          <p className="text-green-400 text-xl font-medium mb-2">🐾 PawChain</p>
          <p className="text-white/50 text-xs leading-relaxed max-w-[220px] mb-4">
            A decentralized pet marketplace powered by Solana. Buy and adopt pets with crypto on Devnet.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-400/10 border border-green-400/30 rounded-full px-3 py-1 text-xs text-green-400">
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-yellow-400'}`} />
            {connected ? 'Wallet Connected' : 'Connected to Solana Devnet'}
          </div>
        </div>

        {/* Link columns */}
        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-3">
              {col.title}
            </p>
            <ul className="flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="text-white/60 hover:text-green-400 text-xs transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 pt-5 flex justify-between items-center flex-wrap gap-3">
        <span className="text-white/35 text-xs">
          © {new Date().getFullYear()} PawChain — Built on Solana Devnet · CN6035 Hybrid DApp
        </span>
        <div className="flex gap-2">
          {['𝕏', 'in', 'gh'].map((icon) => (
            <div
              key={icon}
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-xs text-white/60 hover:border-green-400/50 hover:text-green-400 cursor-pointer transition-colors"
            >
              {icon}
            </div>
          ))}
        </div>
      </div>

    </footer>
  );
};

export default Footers;