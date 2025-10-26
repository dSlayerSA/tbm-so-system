import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrders, createOrder } from '../services/api';
import { Order } from '../types/order';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { generateRandomOrder } from '../utils/randomData';

const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    try {
      const data = await fetchOrders();
      setOrders(data.sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()));
    } catch (err) {
      console.error('Error loading orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  const total = orders.length;
  const pending = orders.filter(o => o.status.toLowerCase() === 'pendente').length;
  const processing = orders.filter(o => o.status.toLowerCase() === 'processando').length;
  const finished = orders.filter(o => o.status.toLowerCase() === 'finalizado').length;
  const totalValue = orders.reduce((s, o) => s + o.valor, 0);

  const handleQuickCreate = async () => {
    setCreating(true);
    try {
      const random = generateRandomOrder();
      await createOrder(random);
      await load();
    } catch (err) {
      console.error(err);
      alert('Erro ao criar pedido');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400 mt-1">Sistema de Gerenciamento de Pedidos</p>
          </div>
          <div className="space-x-3">
            <Link to="/orders/create" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Criar Pedido</Link>
            <button onClick={handleQuickCreate} disabled={creating} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">
              {creating ? 'Criando...' : 'Criar Aleatório'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-800 rounded shadow">
            <h3 className="text-sm font-medium text-gray-400">Total de Pedidos</h3>
            <div className="text-2xl font-bold text-white">{total}</div>
          </div>
          <div className="p-4 bg-gray-800 rounded shadow">
            <h3 className="text-sm font-medium text-gray-400">Pendentes</h3>
            <div className="text-2xl font-bold text-yellow-300">{pending}</div>
          </div>
          <div className="p-4 bg-gray-800 rounded shadow">
            <h3 className="text-sm font-medium text-gray-400">Em Processamento</h3>
            <div className="text-2xl font-bold text-blue-300">{processing}</div>
          </div>
          <div className="p-4 bg-gray-800 rounded shadow">
            <h3 className="text-sm font-medium text-gray-400">Finalizados</h3>
            <div className="text-2xl font-bold text-green-300">{finished}</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Últimos Pedidos</h2>
            <div className="text-sm text-gray-400">Valor total: <span className="font-bold text-green-300">{formatCurrency(totalValue)}</span></div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Cliente</th>
                  <th className="px-4 py-2">Produto</th>
                  <th className="px-4 py-2">Valor</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Data</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="p-6 text-center text-gray-400">Carregando...</td></tr>
                ) : (
                  orders.map(o => (
                    <tr key={o.id} className="border-t border-gray-700 hover:bg-gray-700">
                      <td className="px-4 py-3 text-sm text-gray-300">{o.id.substring(0,8)}...</td>
                      <td className="px-4 py-3 text-sm text-white">{o.cliente}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{o.produto}</td>
                      <td className="px-4 py-3 text-sm text-green-300">{formatCurrency(o.valor)}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          o.status.toLowerCase() === 'pendente' ? 'bg-yellow-200 text-yellow-900' :
                          o.status.toLowerCase() === 'processando' ? 'bg-blue-200 text-blue-900' :
                          'bg-green-200 text-green-900'
                        }`}>{o.status}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">{formatDate(o.dataCriacao)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;