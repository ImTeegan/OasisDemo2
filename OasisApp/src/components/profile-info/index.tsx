// src/components/Sidebar/Sidebar.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { userState } from '../../atoms/sessionState';
import './styles.scss';
import ProfileSidebar from '../profile-sidebar';
import Sidebar from '../sidebar';

const ProfileInfo: React.FC = () => {
    const user = useRecoilValue(userState);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await axios.get('http://localhost:8080/users/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserInfo(response.data);
            } catch (err) {
                console.error('Error fetching user info:', err);
                setError('Error fetching user info.');
            }
        };

        fetchUserInfo();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-info-container">
            <ProfileSidebar />
            <div className="profile-info">
                <h1>Perfil de Usuario</h1>
                <div className="info-item">
                    <label>Nombre Completo:</label>
                    <p>{userInfo.name} {userInfo.lastName}</p>
                </div>
                <div className="info-item">
                    <label>Email:</label>
                    <p>{userInfo.email}</p>
                </div>
                <div className="info-item">
                    <label>Fecha de Creación:</label>
                    <p>{new Date(userInfo.createdAt).toLocaleDateString('es-ES')}</p>
                </div>


            </div>
        </div>
    );
};

export default ProfileInfo;
