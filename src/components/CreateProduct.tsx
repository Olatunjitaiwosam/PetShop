import React, { useState } from 'react';
import { IProduct } from '../models';
import { ErrorMesseage } from './ErrorMesseage';

interface CreateProductProps {
  onCreate: (product: IProduct) => void;
  onClose: () => void;
}

const categories = ['Dogs', 'Cats', 'Birds', 'Rabbits', 'Fish', 'Small Pets'];

const categoryIcons: Record<string, string> = {
  Dogs: '🐕', Cats: '🐈', Birds: '🦜',
  Rabbits: '🐇', Fish: '🐠', 'Small Pets': '🐹',
};

export function CreateProduct({ onCreate, onClose }: CreateProductProps) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!title.trim()) { setError('Please enter a pet name.'); return; }
    if (!price || isNaN(Number(price))) { setError('Please enter a valid price in SOL.'); return; }
    if (!description.trim()) { setError('Please enter a description.'); return; }

    setLoading(true);
    try {
      const product: IProduct = {
        title,
        price: parseFloat(price),
        description,
        rating: { rate: 0, count: 0 },
        image: image || `https://placehold.co/300x200/1a2e1a/7ddc7d?text=${encodeURIComponent(title)}`,
        category,
      };
      await onCreate(product);
    } catch (err: any) {
      setError(err.message || 'Failed to add pet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

        {/* Modal header */}
        <div className="bg-[#0f1f0f] px-6 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-white font-medium text-lg">Add New Pet</h2>
            <p className="text-white/40 text-xs mt-0.5">Fill in the details to list a new pet</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={submitHandler} className="p-6 flex flex-col gap-4">

          {/* Category selector */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`flex flex-col items-center gap-1 py-2 rounded-xl border text-xs font-medium transition-all ${
                    category === c
                      ? 'border-green-400 bg-green-50 text-green-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl">{categoryIcons[c]}</span>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Pet name */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Pet Name</label>
            <input
              type="text"
              className="border border-gray-200 rounded-xl py-2.5 px-4 w-full outline-none focus:border-green-400 text-sm transition-colors"
              placeholder="e.g. Golden Retriever"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          {/* Price */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Price (SOL)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 text-sm font-medium">◎</span>
              <input
                type="number"
                step="0.001"
                min="0"
                className="border border-gray-200 rounded-xl py-2.5 pl-8 pr-4 w-full outline-none focus:border-green-400 text-sm transition-colors"
                placeholder="0.05"
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
            <textarea
              className="border border-gray-200 rounded-xl py-2.5 px-4 w-full outline-none focus:border-green-400 text-sm resize-none transition-colors"
              placeholder="Describe the pet — age, breed, vaccinations..."
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Image URL <span className="text-gray-300">(optional)</span>
            </label>
            <input
              type="text"
              className="border border-gray-200 rounded-xl py-2.5 px-4 w-full outline-none focus:border-green-400 text-sm transition-colors"
              placeholder="https://..."
              value={image}
              onChange={e => setImage(e.target.value)}
            />
            {image && (
              <img
                src={image}
                alt="preview"
                className="mt-2 w-full h-24 object-cover rounded-xl border border-gray-100"
                onError={e => (e.currentTarget.style.display = 'none')}
              />
            )}
          </div>

          {error && <ErrorMesseage error={error} />}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-full py-3 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white rounded-full py-3 text-sm font-medium transition-colors"
            >
              {loading ? 'Adding...' : `Add ${categoryIcons[category]} ${category.slice(0, -1)}`}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}