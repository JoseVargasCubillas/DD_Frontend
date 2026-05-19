import { useCartStore } from '@store/cartStore';
import Button from '@atoms/Button';
import { formatCurrency } from '@utils/formatters';

export default function Checkout() {
  const { items, removeItem, total } = useCartStore();

  return (
    <div className="container-app py-12 max-w-3xl">
      <h1 className="section-title mb-8">Checkout</h1>
      {items.length === 0 ? (
        <p className="text-gray-400">Tu carrito está vacío.</p>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="card divide-y divide-dark-600">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-white font-medium">{item.title}</p>
                  <p className="text-sm text-gray-400">{formatCurrency(item.price)}</p>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-gray-500 hover:text-red-400 text-sm">Eliminar</button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-white">Total: {formatCurrency(total())}</span>
            <Button>Pagar ahora</Button>
          </div>
        </div>
      )}
    </div>
  );
}
