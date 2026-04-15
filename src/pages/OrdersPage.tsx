import { useOrders } from '../hooks/useOrders';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/Loader';
import { Link } from 'react-router-dom';

export function OrdersPage() {
  const { user } = useAuth();
  const { orders, loading } = useOrders();

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 pt-20">
        <p className="text-4xl mb-4">🔒</p>
        <h2 className="text-xl font-medium text-gray-700 mb-2">Sign in to view your orders</h2>
        <p className="text-sm text-gray-400">Your order history will appear here after you sign in.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-6 pt-20 pb-10">
      <div className="mb-8">
        <h2 className="text-2xl font-medium text-gray-800">My Orders</h2>
        <p className="text-sm text-gray-400 mt-1">{orders.length} purchase{orders.length !== 1 ? 's' : ''} made</p>
      </div>

      {loading && <Loader />}

      {!loading && orders.length === 0 && (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">🛍️</p>
          <p className="text-base font-medium text-gray-500">No orders yet</p>
          <p className="text-sm text-gray-400 mt-1 mb-6">Your purchases will appear here</p>
          <Link
            to="/"
            className="bg-green-500 text-white text-sm px-6 py-2.5 rounded-full inline-block"
          >
            Browse Pets
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {orders.map(order => (
          <div
            key={order.id}
            className="bg-white border border-gray-100 rounded-2xl p-5 flex justify-between items-center gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl">
                🐾
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">{order.product_title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(order.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </p>
                <p className="text-xs text-gray-300 font-mono mt-0.5">
                  {order.wallet_address?.slice(0, 8)}...{order.wallet_address?.slice(-4)}
                </p>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="text-green-500 font-medium text-sm">◎ {order.amount_sol} SOL</p>
              <span className="inline-block mt-1 text-xs bg-green-50 text-green-600 px-2.5 py-0.5 rounded-full border border-green-100">
                {order.status}
              </span>
              <a
                href={`https://explorer.solana.com/tx/${order.tx_signature}?cluster=devnet`}
                target="_blank"
                rel="noreferrer"
                className="block text-xs text-gray-400 hover:text-green-500 mt-1.5 transition-colors"
              >
                View tx ↗
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}