import { useEffect, useState } from 'react';
import { Order } from '../types/order';
import { fetchOrders } from '../services/api';

const useOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const fetchedOrders = await fetchOrders();
                setOrders(fetchedOrders);
            } catch (err) {
                setError('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    return { orders, loading, error };
};

export default useOrders;