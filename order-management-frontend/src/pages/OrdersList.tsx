import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Order } from '../types/order';
import { fetchOrders, createOrder } from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { generateRandomOrder } from '../utils/randomData';

const OrdersList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingQuickOrder, setLoadingQuickOrder] = useState(false);

  const loadOrders = async () => {
    try {
      const data = await fetchOrders();
      setOrders(data.sort((a, b) => 
        new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()
      ));
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickCreate = async () => {
    if (loadingQuickOrder) return;
    setLoadingQuickOrder(true);
    try {
      const randomOrder = generateRandomOrder();
      await createOrder(randomOrder);
      loadOrders();
    } catch (err) {
      console.error('Error creating random order:', err);
      alert('Erro ao criar pedido aleatório');
    } finally {
      setLoadingQuickOrder(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  return (
    <div className="max-w-7xl mx-auto text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Lista de Pedidos</h1>
          <p className="text-gray-600">Gerencie seus pedidos</p>
        </div>
        <div className="space-x-4">
          <button
            onClick={handleQuickCreate}
            disabled={loadingQuickOrder}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loadingQuickOrder ? 'Criando...' : 'Criar Pedido Aleatório'}
          </button>
          <Link
            to="/create"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors inline-block"
          >
            Novo Pedido
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-400">Carregando pedidos...</div>
        </div>
      ) : (
        <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900 text-gray-400">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Produto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Valor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Data</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-700 border-t border-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.id.substring(0, 8)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{order.cliente}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.produto}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-300">
                      {formatCurrency(order.valor)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {formatDate(order.dataCriacao)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">Nenhum pedido encontrado</p>
              <button
                onClick={handleQuickCreate}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Criar Pedido de Teste
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersList;