import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import BannerComponent from '../../components/heroBanner';
import CustomProduct from '../../components/custom-product';
import { customProductIdState, editCustomProduct } from '../../atoms/customProductAtom';
import axios from 'axios';
import './styles.scss';

const Create: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [customProductId, setCustomProductId] = useRecoilState(customProductIdState);
    const [editCustom, setEditCustomProduct] = useRecoilState(editCustomProduct);

    useEffect(() => {
        if (!editCustom) {
            setShowModal(true);
        }
    }, [editCustom]);

    const handleCreateClick = async () => {
        setShowModal(false);
        const token = localStorage.getItem('token');
        if (!token || editCustom) return;

        try {
            const response = await axios.post('http://localhost:8080/customProduct/create', {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCustomProductId(response.data.id);
        } catch (error) {
            console.error('Failed to create custom product:', error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
            {showModal && (
                <div className="modal1">
                    <div className="modal-content1">
                        <button className="close-button1" onClick={handleCloseModal}>X</button>
                        <h2 className='modalCreate1'>Bienvenido al taller de flores!</h2>
                        <ul className='modalul'>
                            <li className='modalli'>1. Escoge hasta 3 de tus flores favoritas, hasta dos papeles y hasta 2 follajes.</li>
                            <li className='modalli'>2. Agrega el producto a tu carrito o bien, a tu Lista de deseos para comprarlo después.</li>
                            <li className='modalli'>3. Diviértete en el proceso.</li>
                        </ul>
                        <button className='buttoncreate' onClick={handleCreateClick}>Crear</button>
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
