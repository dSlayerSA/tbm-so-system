import { useState } from 'react';
import { CreateOrderInput } from '../types/order';
import { createOrder } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { generateRandomOrder } from '../utils/randomData';

interface Props {
  onCreated?: () => void;
}

const OrderForm = ({ onCreated }: Props) => {
  const [form, setForm] = useState<CreateOrderInput>({ cliente: '', produto: '', valor: 0 });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'valor' ? parseFloat(value || '0') : value } as any));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createOrder(form as any);
      setForm({ cliente: '', produto: '', valor: 0 });
      onCreated?.();
      navigate('/orders');
    } catch (err) {
      console.error(err);
      alert('Erro ao criar pedido. Veja o console para detalhes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-6 bg-white rounded-lg shadow">
      <div>
        <label htmlFor="cliente" className="block text-sm font-medium text-gray-700">Cliente</label>
        <input
          id="cliente"
          name="cliente"
          value={form.cliente}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="Nome do cliente"
        />
      </div>

      <div>
        <label htmlFor="produto" className="block text-sm font-medium text-gray-700">Produto</label>
        <input
          id="produto"
          name="produto"
          value={form.produto}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="Nome do produto"
        />
      </div>

      <div>
        <label htmlFor="valor" className="block text-sm font-medium text-gray-700">Valor</label>
        <input
          id="valor"
          name="valor"
          type="number"
          step="0.01"
          min="0"
          value={form.valor}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="0.00"
        />
      </div>

      <div className="space-y-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Criando...' : 'Criar Pedido'}
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => setForm(generateRandomOrder())}
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          Gerar Pedido Aleatório
        </button>
      </div>
    </form>
  );
};

export default OrderForm;
