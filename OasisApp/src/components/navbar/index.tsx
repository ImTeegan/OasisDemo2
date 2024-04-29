import React, { useEffect, useState } from 'react';
import './styles.scss';
import logo from '../../../public/images/Logoalternativo.png';
import shoppingBag from '../../../public/icons/shoppingBag.png';
import userIcon from '../../../public/icons/userIcon.png';
import logoutIcon from '../../../public/icons/logoutIcon.png';
import { useRecoilState } from 'recoil';
import { selectedProductsState } from '../../atoms/cartAtom';
import { userState } from '../../atoms/sessionState';
import { Link, useNavigate } from 'react-router-dom';


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
            <div className="logo">
                <img src={logo} alt="Logo" />
            </div>
            <div className="rightmenu">
                <ul className={isOpen ? "navMenuActive" : "navMenu"}>
                    <li className='link-tabs'><a href="#products">Productos</a></li>
                    <li className='link-tabs'><a href="#events">Eventos</a></li>
                    <li className='link-tabs'><Link to="/create">Crear</Link></li>
                    <li>{user.isLoggedIn ? (
                        <div className="user-menu" onClick={toggleDropdown}>
                            {user.name} {/* Muestra el nombre del usuario */}
                            <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                                <div className='element-dm'><Link className='clasea-test' to="/profile"> <img className='userImg' src={userIcon} alt="" /> Perfil</Link></div>
                                <div className='element-dm'><button className='plain-button' onClick={handleLogout}><img className='userImg' src={logoutIcon} alt="" />Cerrar sesión</button></div>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login">Iniciar Sesión</Link>
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
                        {selectedProducts.map((product) => (
                            <div key={product.id}>
                                <h3>{product.productName}</h3>
                                <p>Cantidad: {product.quantity}</p>
                                <p>{product.price}</p>
                                <button onClick={() => deleteProduct(product.id)}>Eliminar</button>
                            </div>
                        ))}
                        <Link to="/checkout">Finalizar compra</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
