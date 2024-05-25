import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Product } from '../../types/types';
import './styles.scss';
import shoppingBag from '../../../public/icons/shoppingBag.png';
import { useRecoilState } from 'recoil';
import { selectedProductsState } from '../../atoms/cartAtom';
import { userState } from '../../atoms/sessionState';

const ProductDetailsComponent: React.FC = () => {
    const { id } = useParams(); // Obtener el ID del producto desde la URL
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedProducts, setSelectedProducts] = useRecoilState(selectedProductsState);
    const [quantity, setQuantity] = useState(1);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [user, setUser] = useRecoilState(userState);   // Estado de sesión
    const navigate = useNavigate();

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Failed to fetch product details:', error);
            }
        };

        loadProduct();
    }, [id]);

    const addProductToCart = async () => {
        if (!user.isLoggedIn) {
            // Si no está logueado, redirige al login
            navigate('/login');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await axios.post('http://localhost:8080/shoppingcart/addProduct', {
                productId: product?.id,
                quantity: quantity,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Actualizar el estado del carrito con la respuesta del servidor
            const updatedProduct = { ...product, quantity };
            setSelectedProducts(prevProducts => {
                const existingProduct = prevProducts.find(p => p.id === updatedProduct.id);
                if (existingProduct) {
                    return prevProducts.map(p => p.id === updatedProduct.id ? { ...p, quantity: p.quantity + updatedProduct.quantity } : p);
                } else {
                    return [...prevProducts, updatedProduct];
                }
            });

            setNotificationMessage("Producto agregado al carrito");
            setShowNotification(true);

            setTimeout(() => {
                setShowNotification(false);
            }, 5000);

        } catch (error) {
            console.error('Failed to add product to cart:', error);
            setNotificationMessage("Error al agregar el producto al carrito");
            setShowNotification(true);

            setTimeout(() => {
                setShowNotification(false);
            }, 5000);
        }
    };

    const handleQuantityChange = (num: number) => {
        setQuantity(prev => Math.max(1, prev + num)); // Prevents quantity from going below 1
    };

    if (!product) return <div>Loading...</div>;

    return (
        <div className='productDetails'>
            <div className='productDetails__containerimg'>
                <img src={product.imageUrl} alt={product.name} />
            </div>
            <div className='productDetails__containerdetails'>
                <h1>{product.name}</h1>
                <p className='productDetails__containerdetails__cat'>{product.category}</p>
                <p className='productDetails__containerdetails__des'>{product.description}</p>
                <p className='productDetails__containerdetails__price'>₡{product.price}</p>
                <div>
                    <p>Cantidad:</p>
                    <button onClick={() => handleQuantityChange(-1)}>-</button>
                    <input aria-label='cantidad' type="text" value={quantity} readOnly />
                    <button onClick={() => handleQuantityChange(1)}>+</button>
                </div>
                <button className='buttonAdd' onClick={addProductToCart}>Agregar al carrito<img src={shoppingBag} alt="Cart" /></button>
            </div>
            <div className={`notification ${showNotification ? 'show' : ''}`}>
                {notificationMessage}
            </div>
        </div>
    );
};

export default ProductDetailsComponent;
