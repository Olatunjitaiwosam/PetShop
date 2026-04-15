import { useProducts } from '../hooks/products';
import { useState, useRef } from 'react';
import { IProduct } from '../models';
import { Loader } from '../components/Loader';
import { ErrorMesseage } from '../components/ErrorMesseage';
import { Product } from '../components/Product';
import { CreateProduct } from '../components/CreateProduct';
import { useAdmin } from '../hooks/useAdmin';

const categories = ['Dogs', 'Cats', 'Birds', 'Rabbits', 'Fish', 'Small Pets'];

const categoryIcons: Record<string, string> = {
  Dogs: '🐕', Cats: '🐈', Birds: '🦜',
  Rabbits: '🐇', Fish: '🐠', 'Small Pets': '🐹',
};

interface CategoryRowProps {
  category: string;
  products: IProduct[];
}

function CategoryRow({ category, products }: CategoryRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const icon = categoryIcons[category];

  if (products.length === 0) return null;

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });
  };

  return (
    <div className="mb-10">
      {/* Section header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-lg font-medium text-gray-800">{category}</h3>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {products.length}
          </span>
        </div>

        {/* Arrow controls — hidden on mobile, shown on md+ */}
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-green-400 hover:text-green-500 transition-colors"
          >
            ←
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-green-400 hover:text-green-500 transition-colors"
          >
            →
          </button>
        </div>
      </div>

      {/* Carousel row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
          md:grid md:grid-cols-3 md:overflow-visible md:pb-0"
      >
        {products.map(product => (
          <div
            key={product.id}
            className="min-w-[240px] md:min-w-0 snap-start flex-shrink-0 md:flex-shrink"
          >
            <Product product={product} />
          </div>
        ))}
      </div>

      {/* Mobile scroll indicator dots */}
      <div className="flex justify-center gap-1.5 mt-3 md:hidden">
        {products.map((_, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-200" />
        ))}
      </div>
    </div>
  );
}

export function ProductPage() {
  const { loading, error, products, addProduct } = useProducts();
  const { isAdmin, checking } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | string>('all');

  const createHandler = async (product: IProduct) => {
    await addProduct(product);
    setShowModal(false);
  };

  const categoriesWithProducts = categories.filter(
    cat => products.some(p => p.category === cat)
  );

  return (
    <>
      <div id="products" className="container mx-auto max-w-5xl px-6 py-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-medium text-gray-800">Available Pets</h2>
            <p className="text-sm text-gray-400 mt-1">{products.length} pets listed</p>
          </div>
          {!checking && isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#0f1f0f] hover:bg-[#1a3a1a] text-white text-sm px-5 py-2.5 rounded-full transition-colors flex items-center gap-2"
            >
              <span className="text-green-400 text-lg leading-none">+</span>
              Add Pet
            </button>
          )}
        </div>

        {/* Category tab filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-[#0f1f0f] text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            🐾 All
          </button>
          {categoriesWithProducts.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeTab === cat
                  ? 'bg-[#0f1f0f] text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {categoryIcons[cat]} {cat}
              <span className={`text-xs rounded-full px-1.5 ${
                activeTab === cat ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {products.filter(p => p.category === cat).length}
              </span>
            </button>
          ))}
        </div>

        {loading && <Loader />}
        {error && <ErrorMesseage error={error} />}

        {/* All view — category rows with carousel */}
        {activeTab === 'all' && !loading && (
          categoriesWithProducts.length > 0
            ? categoriesWithProducts.map(cat => (
                <CategoryRow
                  key={cat}
                  category={cat}
                  products={products.filter(p => p.category === cat)}
                />
              ))
            : (
              <div className="text-center py-24 text-gray-400">
                <p className="text-5xl mb-4">🐾</p>
                <p className="text-base font-medium text-gray-500">No pets listed yet</p>
                {!checking && isAdmin && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="mt-6 bg-green-500 text-white text-sm px-6 py-2.5 rounded-full"
                  >
                    Add your first pet
                  </button>
                )}
              </div>
            )
        )}

        {/* Single category view — grid */}
        {activeTab !== 'all' && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products
              .filter(p => p.category === activeTab)
              .map(product => (
                <Product product={product} key={product.id} />
              ))}
          </div>
        )}

      </div>

      {showModal && (
        <CreateProduct
          onCreate={createHandler}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}