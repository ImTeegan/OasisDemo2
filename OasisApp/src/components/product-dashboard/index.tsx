// src/views/ProductDashboard/ProductDashboard.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { useNavigate, Link } from 'react-router-dom';
import { userState } from '../../atoms/sessionState';
import Sidebar from '../sidebar';
import './styles.scss';

const ProductDashboard: React.FC = () => {
    const user = useRecoilValue(userState);
    const [products, setProducts] = useState([]);
    const [type, setType] = useState('Product');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (user.role !== 'SUPER_ADMIN') {
            setError('Acceso denegado. No tiene los permisos necesarios para acceder a esta página.');
        } else {
            fetchProducts();
        }
    }, [type]);

    const fetchProducts = async () => {
        try {
            const endpoint = type === 'Product'
                ? 'http://localhost:8080/products/getAllTypeProducts'
                : 'http://localhost:8080/products/items';

            const response = await axios.get(endpoint);
            const data = type === 'Product' ? response.data.content : response.data;
            setProducts(data);
        } catch (err) {
            console.error('Error al obtener los productos:', err);
        }
    };

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setType(event.target.value);
    };

    const handleEditClick = (productId: number) => {
        navigate(`/edit-product/${productId}`);
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-content">
                <h1>Product Dashboard</h1>
                <div className='upper-section'>
                    <div className="filter-container">
                        <label htmlFor="type">Tipo de Producto:</label>
                        <select id="type" value={type} onChange={handleTypeChange}>
                            <option value="Product">Productos</option>
                            <option value="Item">Items para Producto Personalizado</option>
                        </select>
                    </div>
                    <div>
                        <Link to='/create-product'> Crear Producto</Link>
                    </div>
                </div>

                <div className="product-cards">
                    {products.map((product) => (
                        <div key={product.id} className="product-card">
                            <img src={product.imageUrl} alt={product.name} />
                            <div className="product-info">
                                <h3>{product.name}</h3>
                                <p>₡{product.price}</p>
                                <p>{product.category}</p>
                                <button className="edit-button" onClick={() => handleEditClick(product.id)}>Editar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDashboard;
