// src/views/AdminDashboard/AdminDashboard.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar';
import ProductDashboard from '../../components/product-dashboard';
import OrderDashboard from '../../components/order-dashboard';
import './styles.scss';

const AdminDashboard: React.FC = () => {
    return (
        <div className="admin-dashboard">
            <Sidebar />
            <div className="dashboard-content">

            </div>
        </div>
    );
}

export default AdminDashboard;
