import { Order } from '../types/order'

const BASE = ((import.meta as any).env?.VITE_API_URL as string) || 'http://localhost:5000'

async function request(path: string, opts: RequestInit = {}) {
    const res = await fetch(`${BASE}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...opts
    })
    if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || res.statusText)
    }
    return res.json()
}

export const fetchOrders = async (): Promise<Order[]> => {
    return request('/api/orders')
}

export const fetchOrderById = async (id: string): Promise<Order> => {
    return request(`/api/orders/${id}`)
}

export const createOrder = async (order: Partial<Order>): Promise<Order> => {
    return request('/api/orders', { method: 'POST', body: JSON.stringify(order) })
}