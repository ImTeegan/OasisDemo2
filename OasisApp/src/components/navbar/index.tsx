import React, { useEffect, useState } from 'react';
import './styles.scss';
import logo from '../../../public/images/Logoalternativo.png';
import shoppingBag from '../../../public/icons/shoppingBag.png';
import userIcon from '../../../public/icons/userIcon.png';
import logoutIcon from '../../../public/icons/logoutIcon.png';
import trash from '../../../public/icons/trashIcon.png';
import { useRecoilState } from 'recoil';
import { selectedProductsState } from '../../atoms/cartAtom';
import { userState } from '../../atoms/sessionState';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedProducts, setSelectedProducts] = useRecoilState(selectedProductsState);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user, setUser] = useRecoilState(userState);
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!event.target.closest('.cartModal') && !event.target.closest('.cartIcon')) {
                setIsCartOpen(false);
            }
            if (!event.target.closest('.user-menu')) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    useEffect(() => {
        const loadCartProducts = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const [productsResponse, customProductsResponse] = await Promise.all([
                    axios.get('http://localhost:8080/shoppingcart/products', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                    axios.get('http://localhost:8080/customProduct/shoppingCart', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                ]);

                const products = productsResponse.data.map(item => ({
                    id: item.product.id,
                    productName: item.product.name,
                    description: item.product.description,
                    category: item.product.category,
                    type: item.product.type,
                    price: item.product.price,
                    image1: item.product.imageUrl,
                    quantity: item.quantity,
                }));

                const customProducts = customProductsResponse.data.map(item => ({
                    id: item.id,
                    productName: "Producto Personalizado",
                    description: `Flores: ${item.flowerCount}, Papeles: ${item.paperCount}, Follajes: ${item.foliageCount}`,
                    category: "Personalizado",
                    type: "CustomProduct",
                    price: item.totalCost,
                    image1: item.items[0]?.product.imageUrl,
                    quantity: item.quantity,
                }));

                setSelectedProducts([...products, ...customProducts]);
            } catch (error) {
                console.error('Failed to load cart products:', error);
            }
        };

        if (user.isLoggedIn) {
            loadCartProducts();
        }
    }, [user, setSelectedProducts]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        setSelectedProducts([]);
        setUser({ isLoggedIn: false, name: '', role: '' });
        localStorage.removeItem('token');
        navigate('/login');
    };

    const deleteProduct = async (productId: number, productType: string) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const product = selectedProducts.find(p => p.id === productId && p.type === productType);

        if (product && product.quantity > 1) {
            try {
                if (productType === 'CustomProduct') {
                    await axios.put(`http://localhost:8080/customProduct/decreaseCustomProductQuantity/${productId}`, {}, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                } else {
                    await axios.put(`http://localhost:8080/shoppingcart/reduceProduct/${productId}`, {}, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                }

                setSelectedProducts(prevProducts =>
                    prevProducts.map(p =>
                        p.id === productId && p.type === productType ? { ...p, quantity: p.quantity - 1 } : p
                    )
                );
            } catch (error) {
                console.error('Failed to reduce product quantity:', error);
            }
        } else {
            console.warn('Cannot reduce quantity below 1');
        }
    };

    const totalItems = selectedProducts.reduce((total, product) => total + product.quantity, 0);

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="menuIcon" onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <Link to="/">
                <div className="logo">
                    <img src={logo} alt="Logo" />
                </div>
            </Link>

            {user.role !== 'SUPER_ADMIN' && (
                <div className="rightmenu">
                    <ul className={isOpen ? "navMenuActive" : "navMenu"}>
                        <li className='link-tabs'><Link className='inner-link' to="/product-list">Productos</Link></li>
                        <li className='link-tabs'><Link className='inner-link' to="/create">Crear</Link></li>
                        <li className='link-tabs'>{user.isLoggedIn ? (
                            <div className="user-menu" onClick={toggleDropdown}>
                                {user.name} ▼
                                <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                                    <div className='element-dm'><button className='plain-button' onClick={handleLogout}><img className='userImg' src={logoutIcon} alt="" />Cerrar sesión</button></div>
                                </div>
                            </div>
                        ) : (
                            <Link className='inner-link' to="/login">Iniciar Sesión</Link>
                        )}</li>
                    </ul>
                    <div className="cartIcon" onClick={toggleCart}>
                        <img src={shoppingBag} alt="Cart" />
                        {totalItems > 0 && (
                            <span className="cart-count">{totalItems}</span>
                        )}
                    </div>
                    {isCartOpen && (
                        <div className="cartModal">
                            {selectedProducts.length > 0 ? (
                                selectedProducts.map((product) => (
                                    <div className='cartModal__card' key={product.id}>
                                        <div>
                                            <img src={product.image1} alt="" />
                                        </div>
                                        <div className='card-details'>
                                            <div>
                                                <h3>{product.productName}</h3>
                                                <p>Cantidad: {product.quantity}</p>
                                                <span>₡{product.price}</span>
                                            </div>
                                            <button aria-label='delete' onClick={() => deleteProduct(product.id, product.type)}> <img aria-label='delete' className='imgTrash' src={trash}></img> </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-cart">
                                    <p>Carrito Vacío</p>
                                    <Link className="link-style" to="/product-list">Agregar Productos</Link>
                                </div>
                            )}
                            {selectedProducts.length > 0 && <Link className='link-style' to="/cart">Ver Carrito</Link>}
                        </div>
                    )}
                </div>
            )}

            {user.role === 'SUPER_ADMIN' && (
                <div className="rightmenu">
                    <ul className={isOpen ? "navMenuActive" : "navMenu"}>
                        <li className='link-tabs'><Link className='inner-link' to="/product-list">Productos</Link></li>
                        <li className='link-tabs'><Link className='inner-link' to="/dashboard">Dashboard</Link></li>
                        <li className='link-tabs'>
                            {user.isLoggedIn ? (
                                <div className="user-menu" onClick={toggleDropdown}>
                                    {user.name} ▼
                                    <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                                        <div className='element-dm'><button className='plain-button' onClick={handleLogout}><img className='userImg' src={logoutIcon} alt="" />Cerrar sesión</button></div>
                                    </div>
                                </div>
                            ) : (
                                <Link className='inner-link' to="/login">Iniciar Sesión</Link>
                            )}
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
