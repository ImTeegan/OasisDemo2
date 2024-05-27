import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import BannerComponent from '../../components/heroBanner';
import CustomProduct from '../../components/custom-product';
import { customProductIdState } from '../../atoms/customProductAtom';
import axios from 'axios';
import './styles.scss';

const Create: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [customProductId, setCustomProductId] = useRecoilState(customProductIdState);

    useEffect(() => {
        const createCustomProduct = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                if (!customProductId) {
                    const response = await axios.post('http://localhost:8080/customProduct/create', {}, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setCustomProductId(response.data.id);
                }
            } catch (error) {
                console.error('Failed to create custom product:', error);
            }
        };

        createCustomProduct();
    }, [customProductId, setCustomProductId]);

    const handleCreateClick = async () => {
        setShowModal(false);
    };

    return (
        <>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Bienvenido al taller para crear tu propio ramo de flores</h2>
                        <ul>
                            <li>1. Escoge hasta 3 de tus flores favoritas, hasta dos papeles y hasta 2 follajes.</li>
                            <li>2. Agrega el producto a tu carrito o bien, a tu Lista de deseos para comprarlo después.</li>
                            <li>3. Diviértete en el proceso.</li>
                        </ul>
                        <button onClick={handleCreateClick}>Crear</button>
                    </div>
                </div>
            )}
            <div>
                <BannerComponent title="Ramo Personalizado" subtitle="Para regalar felicidad" />
                <CustomProduct />
            </div>
        </>
    );
};

export default Create;
