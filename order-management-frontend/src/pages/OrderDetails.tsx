import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOrderById } from '../services/api';
import { Order } from '../types/order';

const OrderDetails: React.FC = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!orderId) return;
    fetchOrderById(orderId).then(setOrder).catch(err => console.error(err));
  }, [orderId]);

  if (!order) return <div className="p-6">Carregando...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Detalhes do pedido</h2>
      <div className="space-y-2">
        <div><strong>Cliente:</strong> {order.cliente}</div>
        <div><strong>Produto:</strong> {order.produto}</div>
        <div><strong>Valor:</strong> {order.valor.toFixed(2)}</div>
        <div><strong>Status:</strong> {order.status}</div>
        <div><strong>Data:</strong> {new Date(order.dataCriacao).toLocaleString('pt-BR')}</div>
      </div>
    </div>
  );
};

export default OrderDetails;