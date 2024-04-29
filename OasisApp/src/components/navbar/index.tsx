import React, { useState } from 'react';
import './styles.scss';
import logo from '../../../public/images/Logoalternativo.png';
import shoppingBag from '../../../public/icons/shoppingBag.png';
import { useRecoilState } from 'recoil';
import { selectedProductsState } from '../../atoms/cartAtom';
import { Product } from '../../types/types';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedProducts, setSelectedProducts] = useRecoilState(selectedProductsState);


    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const deleteProduct = (productId: number) => {
        setSelectedProducts(prevProducts => {
            const product = prevProducts.find(p => p.id === productId);
            if (product.quantity > 1) {
                // Si la cantidad es mayor que 1, reduce la cantidad
                return prevProducts.map(p =>
                    p.id === productId ? { ...p, quantity: p.quantity - 1 } : p
                );
            } else {
                // Si la cantidad es 1, elimina el producto del carrito
                return prevProducts.filter(p => p.id !== productId);
            }
        });
    }

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
                    <li><Link to="/create">Crear</Link></li>
                    <li><a href="#login">Login</a></li>
                </ul>
                <div className="cartIcon">
                    <button className='noButton' onClick={toggleCart}>
                        <img src={shoppingBag} alt="Cart" />
                    </button>
                    {isCartOpen && (
                        <div className="cartModal">
                            {selectedProducts.map((product) => (
                                <div key={product.id}>
                                    <h3>{product.productName}</h3>
                                    <p> Cantidad: {product.quantity}</p>
                                    <p>{product.price}</p>
                                    <button onClick={() => deleteProduct(product.id)}>Eliminar</button>
                                </div>

                            ))}
                            <Link to="/checkout">Finalizar compra</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
