import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from '../../atoms/sessionState';
import Sidebar from '../sidebar';
import axios from 'axios';
import './styles.scss';

const CreateProduct: React.FC = () => {
    const user = useRecoilValue(userState);

    if (user.role !== 'SUPER_ADMIN') {
        return <div>Acceso denegado. No tiene los permisos necesarios para acceder a esta página.</div>;
    }

    const [type, setType] = useState('Product');
    const [category, setCategory] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [showNotification, setShowNotification] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !description || !category || !type || !price || !image) {
            setError('Por favor, complete todos los campos.');
            return;
        }
        setError('');

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('type', type);
        formData.append('price', price);
        formData.append('image', image);

        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            await axios.post('http://localhost:8080/products/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000); // Notificación visible por 3 segundos
        } catch (err) {
            console.error('Error al crear el producto:', err);
            setError('Error al crear el producto.');
        }
    };

    const categories = type === 'Product'
        ? ['Ramo', 'Arreglo', 'Oficina', 'Plantas']
        : ['Flor', 'Papel', 'Follaje'];

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-content">
                <h1>Crear Producto</h1>
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
                    <button type="submit" className="submit-button">Crear</button>
                </form>
                {showNotification && (
                    <div className={`notification ${showNotification ? 'show' : ''}`}>
                        Producto creado exitosamente
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateProduct;
