// src/views/OrderDashboard/OrderDashboard.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { userState } from '../../atoms/sessionState';
import Sidebar from '../sidebar';
import './styles.scss';
import { Link, useNavigate } from 'react-router-dom';

interface Order {
    id: number;
    orderNumber: string;
    date: string;
    cost: number;
    status: string;
}

const OrderDashboard: React.FC = () => {
    const user = useRecoilValue(userState);
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (user.role !== 'SUPER_ADMIN') {
            navigate('/forbidden'); // Redirigir a la página de error 403 Forbidden
        } else {
            fetchOrders();
        }
    }, [user.role, navigate]);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await axios.get('http://localhost:8080/orders', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setOrders(response.data);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Error fetching orders.');
        }
    };

    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(date).toLocaleDateString('es-ES', options);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-content">
                <h1>Administrar Órdenes</h1>
                {error && <p className="error-message">{error}</p>}
                <table className="order-table">
                    <thead>
                        <tr>
                            <th>Order Number</th>
                            <th>Date</th>
                            <th>Importe</th>
                            <th>Estado</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.orderNumber}</td>
                                <td>{formatDate(order.date)}</td>
                                <td>₡{order.cost.toLocaleString()}</td>
                                <td>{order.status}</td>
                                <td>
                                    <Link to={`/order-details/${order.id}`}>
                                        <button className="manage-button">Administrar</button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderDashboard;
