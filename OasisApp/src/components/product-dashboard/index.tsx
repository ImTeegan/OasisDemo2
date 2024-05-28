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
    const navigate = useNavigate();

    useEffect(() => {
        if (user.role !== 'SUPER_ADMIN') {
            navigate('/forbidden'); // Redirigir a la página de error 403 Forbidden
        } else {
            fetchProducts();
        }
    }, [type, user.role, navigate]);

    const fetchProducts = async () => {
        try {
            const endpoint = type === 'Product'
                ? 'http://localhost:8080/products'
                : 'http://localhost:8080/products/items';

            const response = await axios.get(endpoint);
            const data = type === 'Product' ? response.data : response.data;
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

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-content">
                <h1>Administrar Productos</h1>
                <div className='upper-section'>
                    <div className="filter-container">
                        <label htmlFor="type">Tipo de Producto:</label>
                        <select id="type" value={type} onChange={handleTypeChange}>
                            <option className='option-style' value="Product">Productos</option>
                            <option className='option-style' value="Item">Items para Producto Personalizado</option>
                        </select>
                    </div>
                    <div>
                        <Link className='link-button' to='/create-product'> Crear Producto</Link>
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
