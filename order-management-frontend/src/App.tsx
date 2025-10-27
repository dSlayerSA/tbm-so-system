import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import OrdersList from './pages/OrdersList';
import OrderCreate from './pages/OrderCreate';
import OrderDetails from './pages/OrderDetails';

const App: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sistema de Ordem de Serviço</h1>
        <nav className="space-x-4">
          <Link to="/" className="text-blue-600 hover:text-blue-800">Dashboard</Link>
          <Link to="/orders" className="text-blue-600 hover:text-blue-800">lista de OS</Link>
          <Link to="/orders/create" className="text-blue-600 hover:text-blue-800">Criar OS</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<OrdersList />} />
          <Route path="/orders/create" element={<OrderCreate />} />
          {/* legacy route for compatibility */}
          <Route path="/create" element={<OrderCreate />} />
          <Route path="/orders/:orderId" element={<OrderDetails />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;