import { useEffect, useState } from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import { Order } from '../types/order';
import { fetchOrders } from '../services/api';

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  const statusClass = (s: string) => {
    switch (s.toLowerCase()) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'processando':
        return 'bg-blue-100 text-blue-800';
      case 'finalizado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-6 text-gray-400">Carregando pedidos...</div>;

  return (
    <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-gray-100">Pedidos</h2>
      </div>
      <table className="min-w-full">
        <thead className="bg-gray-900 text-gray-400">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Cliente</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Produto</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Valor</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Data</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} className="hover:bg-gray-700 border-t border-gray-700">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{o.cliente}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{o.produto}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-300">{formatCurrency(o.valor)}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass(o.status)}`}>
                  {o.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(o.dataCriacao).toLocaleString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && !loading && (
        <div className="p-6 text-center text-gray-400">Nenhum pedido encontrado</div>
      )}
    </div>
  );
};

export default OrderList;
