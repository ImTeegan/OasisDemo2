// src/views/EditProduct/EditProduct.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { userState } from '../../atoms/sessionState';
import Sidebar from '../sidebar';
import './styles.scss';

const ProductToEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const user = useRecoilValue(userState);
    const [product, setProduct] = useState<any>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [type, setType] = useState('');
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/products/${id}`);
                const productData = response.data;
                setProduct(productData);
                setName(productData.name);
                setDescription(productData.description);
                setCategory(productData.category);
                setPrice(productData.price.toString());
                setType(productData.type);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [id]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        if (name) formData.append('name', name);
        if (description) formData.append('description', description);
        if (category) formData.append('category', category);
        if (type) formData.append('type', type);
        if (price) formData.append('price', price);
        if (image) formData.append('image', image);

        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            await axios.put(`http://localhost:8080/products/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Producto actualizado exitosamente');
        } catch (err) {
            console.error('Error al actualizar el producto:', err);
            setError('Error al actualizar el producto.');
        }
    };

    const handleDeleteProduct = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            await axios.delete(`http://localhost:8080/products/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNotificationMessage("Producto eliminado");
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
                navigate('/admin-dashboard/product');
            }, 3000);
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    };

    const categories = type === 'Product'
        ? ['Ramo', 'Arreglo', 'Oficina', 'Plantas']
        : ['Flor', 'Papel', 'Follaje'];

    if (user.role !== 'SUPER_ADMIN') {
        return <div>Acceso denegado. No tiene los permisos necesarios para acceder a esta página.</div>;
    }

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-content">
                <h1>Editar Producto</h1>
                <button className="delete-button" onClick={() => setShowModal(true)}>Eliminar Producto</button>
                <form onSubmit={handleSubmit} className="edit-product-form">
                    <div className="form-group">
                        <label htmlFor="type">Tipo:</label>
                        <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="Product">Producto</option>
                            <option value="Item">Item para producto personalizado</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Categoría:</label>
                        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="">Seleccione una categoría</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Nombre:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Descripción:</label>
                        <input
                            type="text"
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Precio:</label>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">Imagen:</label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="submit-button">Guardar Cambios</button>
                </form>
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <p>¿Estás seguro de eliminar el producto "{name}"?</p>
                            <button onClick={() => setShowModal(false)}>Atrás</button>
                            <button onClick={handleDeleteProduct}>Sí, eliminar</button>
                        </div>
                    </div>
                )}
                {showNotification && (
                    <div className="notification">
                        {notificationMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductToEdit;
