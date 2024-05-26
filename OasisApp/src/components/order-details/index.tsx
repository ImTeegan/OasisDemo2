// src/views/OrderDetails/OrderDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { userState } from '../../atoms/sessionState';
import Sidebar from '../sidebar';
import './styles.scss';

const OrderDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [userDetails, setUserDetails] = useState<any>(null);
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const orderResponse = await axios.get(`http://localhost:8080/orders/${id}/details`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setOrder(orderResponse.data);
                setStatus(orderResponse.data.status);

                const userResponse = await axios.get(`http://localhost:8080/users/${orderResponse.data.userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserDetails(userResponse.data);
            } catch (err) {
                console.error('Error fetching order details:', err);
                setError('Error fetching order details.');
            }
        };

        fetchOrderDetails();
    }, [id]);

    const handleStatusChange = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await axios.put(`http://localhost:8080/orders/${id}/changeStatus?status=${status}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
            }, 5000);
        } catch (err) {
            console.error('Error updating order status:', err);
            setError('Error updating order status.');
        }
    };

    if (user.role !== 'SUPER_ADMIN') {
        return <div>Acceso denegado. No tiene los permisos necesarios para acceder a esta página.</div>;
    }

    if (!order || !userDetails) return <div>Loading...</div>;

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-content">
                <h1>Detalles de la Orden</h1>
                <div className="order-details">
                    <div className="order-status">
                        <label htmlFor="status">Estado:</label>
                        <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="PENDIENTE">PENDIENTE</option>
                            <option value="CANCELADO">CANCELADO</option>
                            <option value="ACEPTADO">ACEPTADO</option>
                        </select>
                        <button onClick={handleStatusChange}>Cambiar Estado</button>
                    </div>
                    <h2>Resumen de la Orden</h2>
                    <p><strong>Número de Orden:</strong> {order.orderNumber}</p>
                    <p><strong>Nombre del Usuario:</strong> {userDetails.name} {userDetails.lastName}</p>
                    <p><strong>Email:</strong> {userDetails.email}</p>
                    <p><strong>Fecha:</strong> {new Date(order.date).toLocaleDateString('es-ES')}</p>
                    <p><strong>Dirección:</strong> {order.address1}, {order.address2}</p>
                    <p><strong>Ciudad:</strong> {order.city}</p>
                    <p><strong>Provincia:</strong> {order.province}</p>
                    <p><strong>Código Postal:</strong> {order.zipCode}</p>
                    <p><strong>Tarjeta:</strong> {'*'.repeat(12) + order.card}</p>
                    <h2>Productos</h2>
                    <table className="order-products-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.productDetails.map((product, index) => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>₡{product.price.toLocaleString()}</td>
                                    <td>{order.orderProducts[index].quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p><strong>Costo Total:</strong> ₡{order.cost.toLocaleString()}</p>
                    <div className={`notification ${showNotification ? 'show' : ''}`}>
                        Estado de la orden actualizado.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
