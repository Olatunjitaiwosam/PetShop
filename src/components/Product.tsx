import React, { useState } from 'react';
import { IProduct } from '../models';
import { useCheckout } from '../hooks/useCheckout';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProductProps {
  product: IProduct;
}

const categoryIcons: Record<string, string> = {
  Dogs: '🐕', Cats: '🐈', Birds: '🦜',
  Rabbits: '🐇', Fish: '🐠', 'Small Pets': '🐹',
};

export function Product({ product }: ProductProps) {
  const [showModal, setShowModal] = useState(false);
  const { buyNow, loading, txSignature, error, success, reset } = useCheckout();
  const { user } = useAuth();
  const icon = categoryIcons[product.category] || '🐾';

  const navigate = useNavigate();

  const handleClose = () => {
    setShowModal(false);
    reset();
  };
    const handleSuccess = () => {
        setShowModal(false);
        reset();
        navigate('/orders');
    };


  return (
    <>
      {/* Product Card */}
      <div
        onClick={() => setShowModal(true)}
        className="bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
      >
        <div className="relative h-44 bg-gray-50 overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => {
              e.currentTarget.style.display = 'none';
              (e.currentTarget.nextElementSibling as HTMLElement)?.classList.remove('hidden');
            }}
          />
          <div className="hidden absolute inset-0 flex items-center justify-center text-6xl bg-gray-50">
            {icon}
          </div>
          <span className="absolute top-3 left-3 bg-white/90 text-gray-600 text-xs px-2.5 py-1 rounded-full border border-gray-100">
            {icon} {product.category}
          </span>
        </div>

        <div className="p-4">
          <h3 className="font-medium text-gray-800 text-sm mb-1 truncate">{product.title}</h3>
          <p className="text-gray-400 text-xs line-clamp-2 mb-3">{product.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-green-500 font-medium text-sm">◎ {product.price} SOL</span>
            <span className="text-xs text-white bg-[#0f1f0f] px-3 py-1.5 rounded-full">
              View details
            </span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={handleClose}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative h-52 bg-gray-50">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={e => {
                  e.currentTarget.style.display = 'none';
                  (e.currentTarget.nextElementSibling as HTMLElement)?.classList.remove('hidden');
                }}
              />
              <div className="hidden absolute inset-0 flex items-center justify-center text-8xl bg-gray-50">
                {icon}
              </div>
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center text-sm transition-colors"
              >
                ✕
              </button>
              <span className="absolute bottom-3 left-3 bg-white/90 text-gray-600 text-xs px-2.5 py-1 rounded-full border border-gray-100">
                {icon} {product.category}
              </span>
            </div>

            {/* Content */}
            <div className="p-6">

              {/* Success state */}
              {success ? (
                <div className="text-center py-4">
                  <div className="text-5xl mb-3">🎉</div>
                  <h3 className="text-lg font-medium text-gray-800 mb-1">Purchase Successful!</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    You just adopted <span className="font-medium text-gray-700">{product.title}</span>
                  </p>
                  <a
                    href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-green-500 hover:underline mb-6 block"
                  >
                    View transaction on Solana Explorer ↗
                  </a>
                  <button
                    onClick={handleSuccess}
                    className="w-full bg-[#0f1f0f] text-white rounded-full py-3 text-sm font-medium"
                    >
                    View My Orders →
                    </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-medium text-gray-800 mb-1">{product.title}</h2>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-medium text-green-500">◎ {product.price}</span>
                    <span className="text-gray-400 text-sm">SOL</span>
                  </div>

                  <p className="text-gray-500 text-sm leading-relaxed mb-5">{product.description}</p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-0.5">Category</p>
                      <p className="text-sm font-medium text-gray-700">{icon} {product.category}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-0.5">Rating</p>
                      <p className="text-sm font-medium text-gray-700">
                        ⭐ {product.rating?.rate ?? 0}
                        <span className="text-gray-400 font-normal"> ({product.rating?.count ?? 0})</span>
                      </p>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
                      <p className="text-red-500 text-xs">{error}</p>
                    </div>
                  )}

                  {!user && (
                    <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3 mb-4">
                      <p className="text-yellow-700 text-xs">Please sign in to purchase this pet.</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={handleClose}
                      className="flex-1 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-full py-3 text-sm transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => buyNow(product)}
                      disabled={loading || !user}
                      className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-full py-3 text-sm font-medium transition-colors"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                          Processing...
                        </span>
                      ) : '◎ Buy Now'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}