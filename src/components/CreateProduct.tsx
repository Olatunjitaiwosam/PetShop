import React, { useState } from 'react';
import { IProduct } from '../models';
import { ErrorMesseage } from './ErrorMesseage';

interface CreateProductProps {
  onCreate: (product: IProduct) => void;
}

const categories = ['Dogs', 'Cats', 'Birds', 'Rabbits', 'Fish', 'Small Pets'];

export function CreateProduct({ onCreate }: CreateProductProps) {
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

    if (!title.trim()) return setError('Please enter a product title.');
    if (!price || isNaN(Number(price))) return setError('Please enter a valid price in SOL.');
    if (!description.trim()) return setError('Please enter a description.');

    setLoading(true);

    const product: IProduct = {
      title,
      price: parseFloat(price),
      description,
      rating: { rate: 0, count: 0 },
      image: image || `https://via.placeholder.com/300x200?text=${encodeURIComponent(title)}`,
      category,
    };

    onCreate(product);
    setLoading(false);
  };

  return (
    <form onSubmit={submitHandler} className="flex flex-col gap-3">

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Pet Name</label>
        <input
          type="text"
          className="border border-gray-200 rounded-xl py-2 px-4 w-full outline-none focus:border-green-400 text-sm"
          placeholder="e.g. Golden Retriever"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Price (SOL)</label>
        <input
          type="number"
          step="0.001"
          className="border border-gray-200 rounded-xl py-2 px-4 w-full outline-none focus:border-green-400 text-sm"
          placeholder="e.g. 0.05"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Category</label>
        <select
          className="border border-gray-200 rounded-xl py-2 px-4 w-full outline-none focus:border-green-400 text-sm"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Description</label>
        <textarea
          className="border border-gray-200 rounded-xl py-2 px-4 w-full outline-none focus:border-green-400 text-sm resize-none"
          placeholder="Describe the pet..."
          rows={3}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Image URL (optional)</label>
        <input
          type="text"
          className="border border-gray-200 rounded-xl py-2 px-4 w-full outline-none focus:border-green-400 text-sm"
          placeholder="https://..."
          value={image}
          onChange={e => setImage(e.target.value)}
        />
      </div>

      {error && <ErrorMesseage error={error} />}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full py-3 text-sm font-medium transition-colors"
      >
        {loading ? 'Adding...' : 'Add Pet'}
      </button>

    </form>
  );
}