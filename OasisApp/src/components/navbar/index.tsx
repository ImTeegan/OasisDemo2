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
import { Link, useLocation, useNavigate } from 'react-router-dom';



const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedProducts, setSelectedProducts] = useRecoilState(selectedProductsState);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user, setUser] = useRecoilState(userState);
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);


    const totalItems = selectedProducts.reduce((total, product) => total + product.quantity, 0);



    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

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

    const handleLogout = () => {
        setSelectedProducts([]);
        setUser({ isLoggedIn: false, name: '' });
        navigate('/login');
    };

    const deleteProduct = (productId: number) => {
        setSelectedProducts(prevProducts => {
            const product = prevProducts.find(p => p.id === productId);
            if (product && product.quantity > 1) {
                return prevProducts.map(p =>
                    p.id === productId ? { ...p, quantity: p.quantity - 1 } : p
                );
            } else {
                return prevProducts.filter(p => p.id !== productId);
            }
        });
    };

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

            <div className="rightmenu">
                <ul className={isOpen ? "navMenuActive" : "navMenu"}>
                    <li className='link-tabs'><Link className='inner-link' to="/product-list">Productos</Link></li>
                    <li className='link-tabs'><a className='inner-link' href="#events">Eventos</a></li>
                    <li className='link-tabs'><Link className='inner-link' to="/create">Crear</Link></li>
                    <li className='link-tabs'>{user.isLoggedIn ? (
                        <div className="user-menu" onClick={toggleDropdown}>
                            {user.name} ▼
                            <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                                <div className='element-dm'><Link className='clasea-test' to="/profile"> <img className='userImg' src={userIcon} alt="" /> Perfil</Link></div>
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
                                        <button onClick={() => deleteProduct(product.id)}> <img className='imgTrash' src={trash}></img> </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-cart">
                                <p>Carrito Vacío</p>
                                <Link className="link-style" to="/product-list">Agregar Productos</Link>
                            </div>
                        )}
                        {selectedProducts.length > 0 && <Link className='link-style' to="/checkout">Ver Carrito</Link>}
                    </div>
                )}

            </div>
        </nav >
    );
};

export default Navbar;
