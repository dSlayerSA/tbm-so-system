export interface Order {
    id: string;
    cliente: string;
    produto: string;
    valor: number;
    status: 'Pendente' | 'Processando' | 'Finalizado';
    dataCriacao: string;
}

export interface CreateOrderInput {
    cliente: string;
    produto: string;
    valor: number;
}