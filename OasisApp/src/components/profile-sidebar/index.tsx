// src/components/Sidebar/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles.scss';

const ProfileSidebar: React.FC = () => {
    const location = useLocation();

    return (
        <div className="sidebar1">
            <ul>
                <li className={location.pathname === '/profile-info' ? 'active' : ''}>
                    <Link to="/profile-info">Perfil</Link>
                </li>
                <li className={location.pathname === '/profile-wishlist' ? 'active' : ''}>
                    <Link to="/profile-wishlist">Lista de deseos</Link>
                </li>
                <li className={location.pathname === '/profile-orders' ? 'active' : ''}>
                    <Link to="/profile-orders">Ordenes</Link>
                </li>

            </ul>
        </div>
    );
}

export default ProfileSidebar;
