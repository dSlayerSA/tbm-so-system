import OrderForm from '../components/OrderForm';

const OrderCreate = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Criar Novo Pedido</h1>
      <OrderForm />
    </div>
  );
};

export default OrderCreate;
