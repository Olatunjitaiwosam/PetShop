import { useProducts } from '../hooks/products';
import { useState } from 'react';
import { IProduct } from '../models';
import { Loader } from '../components/Loader';
import { ErrorMesseage } from '../components/ErrorMesseage';
import { Product } from '../components/Product';
import { CreateProduct } from '../components/CreateProduct';
import { useAdmin } from '../hooks/useAdmin';

export function ProductPage() {
  const { loading, error, products, addProduct } = useProducts();
  const { isAdmin, checking } = useAdmin();
  const [showModal, setShowModal] = useState(false);

  const createHandler = async (product: IProduct) => {
    await addProduct(product);
    setShowModal(false);
  };

  return (
    <>
      <div id="products" className="container mx-auto max-w-5xl px-6 py-10">

        <div className="flex justify-between items-center mb-8">
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

        {loading && <Loader />}
        {error && <ErrorMesseage error={error} />}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map(product => (
            <Product product={product} key={product.id} />
          ))}
        </div>

        {!loading && products.length === 0 && (
          <div className="text-center py-24 text-gray-400">
            <p className="text-5xl mb-4">🐾</p>
            <p className="text-base font-medium text-gray-500">No pets listed yet</p>
            <p className="text-sm mt-1 mb-6">Check back soon or add the first one</p>
            {isAdmin && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-green-500 text-white text-sm px-6 py-2.5 rounded-full"
              >
                Add your first pet
              </button>
            )}
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