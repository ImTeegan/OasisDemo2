import React, { useState } from 'react';
//import styles from './Navbar.module.scss';
//import logo from '../../assets/logo.svg';
//import cartIcon from '../../assets/cart-icon.svg';
import logo from '../../../public/images/Logoalternativo.png';
import shoppingBag from '../../../public/icons/shoppingBag.png';
import './styles.scss'

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar">

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
                    <li><a href="#products">Productos</a></li>
                    <li><a href="#events">Eventos</a></li>
                    <li><a href="#create">Crear</a></li>
                    <li><a href="#login">Login</a></li>
                </ul>
                <div className="cartIcon">
                    <img src={shoppingBag} alt="Cart" />
                </div>
            </div>

        </nav>
    );
};

export default Navbar;
