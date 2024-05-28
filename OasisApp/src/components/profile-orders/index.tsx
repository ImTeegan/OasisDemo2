import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { userState } from '../../atoms/sessionState';
import './styles.scss';
import { Link } from 'react-router-dom';
import ProfileSidebar from '../profile-sidebar';

interface Order {
    id: number;
    orderNumber: string;
    date: string;
    cost: number;
    status: string;
}

const ProfileOrders: React.FC = () => {
    const user = useRecoilValue(userState);
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 700);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await axios.get('http://localhost:8080/orders/my-orders', {
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

        fetchOrders();
    }, []);

    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(date).toLocaleDateString('es-ES', options);
    };

    return (
        <div className='toptop'>
            {isMobile && <ProfileSidebar />}
            <div className="profile-orders-container">
                {!isMobile && <ProfileSidebar />}
                <div className="profile-orders">
                    <div className="orders-content">
                        <h1>Mis Órdenes</h1>
                        {error && <p className="error-message">{error}</p>}
                        {isMobile ? (
                            orders.map(order => (
                                <div key={order.id} className="order-card">
                                    <div className="order-header">Número de Orden: {order.orderNumber}</div>
                                    <div className="order-body">
                                        <div className="order-row">
                                            <span>Fecha:</span>
                                            <span>{formatDate(order.date)}</span>
                                        </div>
                                        <div className="order-row">
                                            <span>Importe:</span>
                                            <span>₡{order.cost.toLocaleString()}</span>
                                        </div>
                                        <div className="order-row">
                                            <span>Estado:</span>
                                            <span>{order.status}</span>
                                        </div>
                                        <Link to={`/user-order-details/${order.id}`}>
                                            <button className="manage-button">Ver detalles</button>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <table className="order-table">
                                <thead>
                                    <tr>
                                        <th>Número de Orden</th>
                                        <th>Fecha</th>
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
                                                <Link to={`/user-order-details/${order.id}`}>
                                                    <button className="manage-button">Ver detalles</button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileOrders;
