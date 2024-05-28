import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import ProfileSidebar from '../profile-sidebar';
import { useRecoilState } from 'recoil';
import { selectedProductsState } from '../../atoms/cartAtom';
import { customProductIdState } from '../../atoms/customProductAtom';
import { editCustomProduct } from '../../atoms/customProductAtom';
import './styles.scss';

const ProfileWishlist: React.FC = () => {
    const navigate = useNavigate();
    const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
    const [productDetails, setProductDetails] = useState<any[]>([]);
    const [customWishlistProducts, setCustomWishlistProducts] = useState<any[]>([]);
    const [error, setError] = useState('');
    const [selectedProducts, setSelectedProducts] = useRecoilState(selectedProductsState);
    const [, setCustomProductId] = useRecoilState(customProductIdState);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);
    const [, setEditCustomproduct] = useRecoilState(editCustomProduct);

    useEffect(() => {
        const fetchWishlistProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const [productResponse, productInfoResponse, customProductResponse] = await Promise.all([
                    axios.get('http://localhost:8080/wishlist/products', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:8080/wishlist/productsInfo', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:8080/customProduct/wishList', { headers: { Authorization: `Bearer ${token}` } })
                ]);

                setWishlistProducts(productResponse.data);
                setProductDetails(productInfoResponse.data);
                setCustomWishlistProducts(customProductResponse.data);
            } catch (err) {
                console.error('Error fetching wishlist products:', err);
                setError('Error fetching wishlist products.');
            }
        };

        fetchWishlistProducts();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 700);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const increaseQuantity = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await axios.put(`http://localhost:8080/wishlist/increaseProduct/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWishlistProducts(prev =>
                prev.map(product =>
                    product.id === id ? { ...product, quantity: product.quantity + 1 } : product
                )
            );
        } catch (err) {
            console.error('Error increasing quantity:', err);
        }
    };

    const decreaseQuantity = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await axios.put(`http://localhost:8080/wishlist/reduceProduct/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWishlistProducts(prev =>
                prev.map(product =>
                    product.id === id ? { ...product, quantity: Math.max(1, product.quantity - 1) } : product
                )
            );
        } catch (err) {
            console.error('Error decreasing quantity:', err);
        }
    };

    const removeProduct = async (productId: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await axios.delete(`http://localhost:8080/wishlist/removeProduct/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setWishlistProducts(prev => prev.filter(product => product.productId !== productId));
        } catch (err) {
            console.error('Error removing product from wishlist:', err);
        }
    };

    const increaseCustomProductQuantity = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await axios.put(`http://localhost:8080/customProduct/increaseCustomProductQuantity/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCustomWishlistProducts(prev =>
                prev.map(product =>
                    product.id === id ? { ...product, quantity: product.quantity + 1 } : product
                )
            );
        } catch (err) {
            console.error('Error increasing custom product quantity:', err);
        }
    };

    const decreaseCustomProductQuantity = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await axios.put(`http://localhost:8080/customProduct/decreaseCustomProductQuantity/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCustomWishlistProducts(prev =>
                prev.map(product =>
                    product.id === id ? { ...product, quantity: Math.max(1, product.quantity - 1) } : product
                )
            );
        } catch (err) {
            console.error('Error decreasing custom product quantity:', err);
        }
    };

    const removeCustomProduct = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await axios.delete(`http://localhost:8080/customProduct/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setCustomWishlistProducts(prev => prev.filter(product => product.id !== id));
        } catch (err) {
            console.error('Error removing custom product from wishlist:', err);
        }
    };

    const moveToCart = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await axios.post('http://localhost:8080/wishlist/moveAndDeleteProductsToShoppingCart', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            await Promise.all(customWishlistProducts.map(customProduct =>
                axios.put(`http://localhost:8080/customProduct/${customProduct.id}/changeContextType?newContextType=SHOPPINGCART`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ));

            setWishlistProducts([]);
            setCustomWishlistProducts([]);

            // Actualizar productos seleccionados en el estado global
            const cartProductsResponse = await axios.get('http://localhost:8080/shoppingcart/products', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const customCartProductsResponse = await axios.get('http://localhost:8080/customProduct/shoppingCart', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const cartProducts = cartProductsResponse.data.map(item => ({
                id: item.product.id,
                productName: item.product.name,
                description: item.product.description,
                category: item.product.category,
                type: item.product.type,
                price: item.product.price,
                image1: item.product.imageUrl,
                quantity: item.quantity
            }));

            const customCartProducts = customCartProductsResponse.data.map(item => ({
                id: item.id,
                productName: item.name,
                description: `Flores: ${item.flowerCount}, Papeles: ${item.paperCount}, Follajes: ${item.foliageCount}`,
                category: "Personalizado",
                type: "CustomProduct",
                price: item.totalCost,
                image1: item.items[0]?.product.imageUrl,
                quantity: item.quantity
            }));

            setSelectedProducts([...cartProducts, ...customCartProducts]);
        } catch (err) {
            console.error('Error moving products to cart:', err);
            setError('Error moving products to cart.');
        }
    };

    const handleEditCustomProduct = (id: number) => {
        setCustomProductId(id);
        setEditCustomproduct(true);
        navigate('/create');
    };

    return (
        <div className="profile-wishlist-container">
            {isMobile && <ProfileSidebar />}
            <div className="profile-wishlist">
                {!isMobile && <ProfileSidebar />}
                <div className="wishlist-content">
                    <h1>Mi Wishlist</h1>
                    {error && <p className="error-message">{error}</p>}
                    <button className="move-to-cart-button" onClick={moveToCart}>Agregar todo al carrito</button>
                    <div className="wishlist-cards">
                        {wishlistProducts.map(product => {
                            const productDetail = productDetails.find(p => p.id === product.productId);
                            if (!productDetail) return null;

                            return (
                                <div className="cards__card" key={product.productId}>
                                    <img src={productDetail.imageUrl} alt={productDetail.name} />
                                    <div className='separing'>
                                        <h2>{productDetail.name}</h2>
                                        <p>₡{productDetail.price}</p>
                                    </div>

                                    <div className='centering'>
                                        <div className="cart-summary__cards__card__quantity-control">
                                            <button onClick={() => decreaseQuantity(product.id)}>-</button>
                                            <span>{product.quantity}</span>
                                            <button onClick={() => increaseQuantity(product.id)}>+</button>
                                        </div>
                                    </div>

                                    <div className="card-buttons">
                                        <Link to={`/product-details/${product.productId}`} className="view-button">Ver Producto</Link>
                                        <button className="wishlistButton" onClick={() => removeProduct(product.productId)}>
                                            <FaHeart color="red" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        {customWishlistProducts.map(customProduct => (
                            <div className="cards__card" key={customProduct.id}>
                                <img src={customProduct.items[0].product.imageUrl} alt="Producto Personalizado" />
                                <div className='separing'>
                                    <h2>{customProduct.name}</h2>
                                    <p>₡{customProduct.totalCost}</p>
                                </div>

                                <div className='centering'>
                                    <div className="cart-summary__cards__card__quantity-control">
                                        <button onClick={() => decreaseCustomProductQuantity(customProduct.id)}>-</button>
                                        <span>{customProduct.quantity}</span>
                                        <button onClick={() => increaseCustomProductQuantity(customProduct.id)}>+</button>
                                    </div>
                                </div>

                                <div className="card-buttons">
                                    <button className="view-button" onClick={() => handleEditCustomProduct(customProduct.id)}>Ver Producto</button>
                                    <button className="wishlistButton" onClick={() => removeCustomProduct(customProduct.id)}>
                                        <FaHeart color="red" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileWishlist;
