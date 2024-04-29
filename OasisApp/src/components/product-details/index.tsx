import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProducts } from '../../services/fetchProducts';
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
                const products = await fetchProducts();
                const foundProduct = products.find(p => p.id.toString() === id); // Asumiendo que id es un string
                setProduct(foundProduct);
            } catch (error) {
                console.error('Failed to fetch product details:', error);
            }
        };

        loadProduct();
    }, [id]);

    const addProductToCart = () => {
        if (!user.isLoggedIn) {
            // Si no está logueado, redirige al login
            navigate('/login');
            return;
        }

        const productToAdd = { ...product, quantity }; // Include the quantity in the product object
        setSelectedProducts(prevProducts => {
            const existingProduct = prevProducts.find(p => p.id === productToAdd.id);
            if (existingProduct) {
                // Update the quantity if the product is already in the cart
                return prevProducts.map(p => p.id === productToAdd.id ? { ...p, quantity: p.quantity + productToAdd.quantity } : p);
            } else {
                // Add new product to the cart
                return [...prevProducts, productToAdd];
            }

        });
        setNotificationMessage("Producto agregado al carrito");
        setShowNotification(true);

        setTimeout(() => {
            setShowNotification(false);
        }, 5000);
    };

    const handleQuantityChange = (num) => {
        setQuantity(prev => Math.max(1, prev + num)); // Prevents quantity from going below 1
    };

    if (!product) return <div>Loading...</div>;



    return (
        <div className='productDetails'>
            <div className='productDetails__containerimg'>
                <img src={product.image1} alt={product.productName} />
            </div>
            <div className='productDetails__containerdetails'>
                <h1>{product.productName}</h1>
                <p className='productDetails__containerdetails__price'>₡{product.price}</p>
                <p className='productDetails__containerdetails__cat'>{product.category}</p>
                <p className='productDetails__containerdetails__des'>{product.description}</p>
                <div>
                    <button onClick={() => handleQuantityChange(-1)}>-</button>
                    <input type="text" value={quantity} readOnly />
                    <button onClick={() => handleQuantityChange(1)}>+</button>
                </div>
                <button onClick={() => addProductToCart(product)}>Agregar al carrito<img src={shoppingBag} /></button>
            </div>
            <div className={`notification ${showNotification ? 'show' : ''}`}>
                {notificationMessage}
            </div>


        </div>
    );
};

export default ProductDetailsComponent;
