import React from 'react';

interface Animal {
  icon: string;
  name: string;
  price: string;
}

const animals: Animal[] = [
  { icon: '🐕', name: 'Golden Retriever', price: '0.05 SOL' },
  { icon: '🐈', name: 'Persian Cat', price: '0.03 SOL' },
  { icon: '🐇', name: 'Holland Lop', price: '0.02 SOL' },
  { icon: '🦜', name: 'African Grey', price: '0.08 SOL' },
];

const HeroSection: React.FC = () => {
  return (
    <section className="w-full flex min-h-[100vh] items-center bg-[#1a2e1a] py-12">
      <div className='w-full max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 gap-10'>

        {/* Left content */}
        <div className="z-20 w-full md:max-w-xl text-center md:text-left">
          <span className="inline-block text-xs text-green-300 border border-green-400/40 bg-green-400/10 px-3 py-1 rounded-full mb-4 tracking-wide">
            New arrivals this week
          </span>

          <h1 className="text-4xl md:text-5xl font-medium text-white leading-tight mb-4">
            Find your perfect <br />
            <span className="text-green-400">furry companion</span>
          </h1>

          <p className="text-white/70 text-base leading-relaxed mb-8 max-w-md mx-auto md:mx-0">
            Browse our curated selection of healthy, vaccinated pets.
            Pay seamlessly with SOL on Solana Devnet.
          </p>

          <div className="flex gap-3 flex-wrap items-center justify-center md:justify-start">
            <button
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Shop Pets
            </button>
          </div>
        </div>

        {/* Right animal cards */}
        <div className="w-full md:w-[45%] z-10 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs md:max-w-none">
            {animals.map((animal) => (
              <div
                key={animal.name}
                className="bg-white/10 border border-white/15 rounded-xl p-4 text-center backdrop-blur-sm"
              >
                <span className="text-4xl md:text-7xl block mb-2">{animal.icon}</span>
                <span className="text-white/90 text-sm font-medium block">{animal.name}</span>
                <span className="text-green-400 text-xs block mt-1">{animal.price}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;