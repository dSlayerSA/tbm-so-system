import { useEffect, useState } from 'react';
import { Order } from '../types/order';
import { fetchOrders } from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';

interface Props {
  pageSize?: number;
}

const statusColors: Record<string, string> = {
  pendente: 'bg-yellow-100 text-yellow-800',
  processando: 'bg-blue-100 text-blue-800',
  finalizado: 'bg-green-100 text-green-800',
};

const OrderTable = ({ pageSize = 10 }: Props) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);

  const load = async () => {
    setLoading(true);
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

  const filtered = orders.filter(o =>
    o.cliente.toLowerCase().includes(filter.toLowerCase()) ||
    o.produto.toLowerCase().includes(filter.toLowerCase()) ||
    o.status.toLowerCase().includes(filter.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="bg-gray-800 rounded-lg shadow p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <input
          type="text"
          placeholder="Filtrar por cliente, produto ou status..."
          className="w-full md:w-1/3 px-3 py-2 rounded bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={filter}
          onChange={e => { setFilter(e.target.value); setPage(1); }}
        />
        <div className="text-gray-400 text-sm mt-2 md:mt-0">{filtered.length} pedidos encontrados</div>
      </div>
      <div className="overflow-x-auto">
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
            {paginated.map(o => (
              <tr key={o.id} className="hover:bg-gray-700 border-t border-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{o.cliente}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{o.produto}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-300">{formatCurrency(o.valor)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[o.status.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>{o.status}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(o.dataCriacao).toLocaleString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {paginated.length === 0 && !loading && (
          <div className="p-6 text-center text-gray-400">Nenhum pedido encontrado</div>
        )}
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-3 py-1 rounded bg-gray-700 text-gray-200 disabled:opacity-50"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >Anterior</button>
        <span className="text-gray-300">Página {page} de {totalPages || 1}</span>
        <button
          className="px-3 py-1 rounded bg-gray-700 text-gray-200 disabled:opacity-50"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || totalPages === 0}
        >Próxima</button>
      </div>
    </div>
  );
};

export default OrderTable;
