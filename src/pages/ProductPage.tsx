import { useProducts } from '../hooks/products';
import { useContext } from 'react';
import { ModalContext } from '../context/ModalContext';
import { IProduct } from '../models';
import { Loader } from '../components/Loader';
import { ErrorMesseage } from '../components/ErrorMesseage';
import { Product } from '../components/Product';
import { Modal } from '../components/Modal';
import { CreateProduct } from '../components/CreateProduct';
import { useAdmin } from '../hooks/useAdmin';
import HeroSection from '../components/HeroSection';

export function ProductPage() {
  const { loading, error, products, addProduct } = useProducts();
  const { modal, open, close } = useContext(ModalContext);
  const { isAdmin } = useAdmin();

  const createHandler = (product: IProduct) => {
    close();
    addProduct(product);
  };

  return (
    <>
      <div id="products" className="container mx-auto max-w-5xl px-6 py-10">

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-medium text-gray-800">Available Pets</h2>
          {isAdmin && (
            <button
              onClick={() => open()}
              className="bg-green-500 hover:bg-green-600 text-white text-sm px-5 py-2 rounded-full transition-colors"
            >
              + Add Pet
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
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🐾</p>
            <p className="text-sm">No pets available yet.</p>
            {isAdmin && (
              <button
                onClick={() => open()}
                className="mt-4 bg-green-500 text-white text-sm px-5 py-2 rounded-full"
              >
                Add your first pet
              </button>
            )}
          </div>
        )}

      </div>

      {modal && (
        <Modal title="Add New Pet" onClose={() => close()}>
          <CreateProduct onCreate={createHandler} />
        </Modal>
      )}
    </>
  );
}