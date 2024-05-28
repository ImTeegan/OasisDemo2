// src/components/Sidebar/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles.scss';

const Sidebar: React.FC = () => {
    const location = useLocation();

    return (
        <div className="sidebar">
            <ul>
                <li className={location.pathname === '/admin-dashboard/product' ? 'active' : ''}>
                    <Link to="/admin-dashboard/product">Administrar Productos</Link>
                </li>
                <li className={location.pathname === '/admin-dashboard/order' ? 'active' : ''}>
                    <Link to="/admin-dashboard/order">Administrar Órdenes</Link>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
