export function generateRandomOrder() {
  const produtos = [
    'Widget Pro',
    'Widget Ultra',
    'Widget Elite',
    'Widget Supreme',
    'Widget Master',
    'Widget Plus',
    'Widget MAX',
    'Widget Ultimate',
  ];

  const clientes = [
    'João Silva',
    'Maria Santos',
    'Pedro Oliveira',
    'Ana Souza',
    'Carlos Ferreira',
    'Beatriz Lima',
    'Lucas Pereira',
    'Julia Costa',
  ];

  return {
    cliente: clientes[Math.floor(Math.random() * clientes.length)],
    produto: produtos[Math.floor(Math.random() * produtos.length)],
    valor: Number((Math.random() * 4000 + 1000).toFixed(2)), // Valor entre 1000 e 5000
  };
}