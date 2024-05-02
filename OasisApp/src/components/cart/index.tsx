import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../../types/types';
import './styles.scss';
import { useRecoilState } from 'recoil';
import { selectedProductsState } from '../../atoms/cartAtom';
import trash from '../../../public/icons/trashIcon.png';


const CartComponent = () => {
    const [selectedProducts, setSelectedProducts] = useRecoilState(selectedProductsState);
    const navigate = useNavigate();


    const handleQuantityChange = (productId: number, delta: number) => {
        setSelectedProducts(currentProducts =>
            currentProducts.map(product =>
                product.id === productId ? { ...product, quantity: Math.max(1, product.quantity + delta) } : product
            )
        );
    };

    const handleOnNext = () => {
        navigate('/checkout');
    }

    const handleRemoveProduct = (productId: number) => {
        setSelectedProducts(currentProducts =>
            currentProducts.filter(product => product.id !== productId)
        );
    };

    const totalPrice = selectedProducts.reduce((acc, product) => acc + product.price * product.quantity, 0);
    const totalItems = selectedProducts.reduce((total, product) => total + product.quantity, 0);

    return (
        <>

            <div className='cart-summary'>

                <div className='cart-summary__cards'>
                    <h2>Carrito de compras</h2>
                    {selectedProducts.map(product => (
                        <div className='cart-summary__cards__card' key={product.id}>
                            <div>
                                <img src={product.image1} alt={product.productName} />
                            </div>
                            <div>
                                <div className='headerp'>
                                    <h4 className='pname'>{product.productName}</h4>
                                    <p className='pricep'> ₡{product.price}</p>
                                </div>
                                <p> {product.description}</p>

                                <div className='headerp'>
                                    <div className='cart-summary__cards__card__quantity-control'>
                                        <button onClick={() => handleQuantityChange(product.id, -1)}>-</button>
                                        <input aria-label='cantidad' type="text" value={product.quantity} readOnly />
                                        <button onClick={() => handleQuantityChange(product.id, 1)}>+</button>
                                    </div>
                                    <button aria-label='delete' onClick={() => handleRemoveProduct(product.id)} className="remove-button"><img alt='delete' className='imgTrash1' src={trash}></img></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='cart-summary__rightsection'>
                    <p>{totalItems} productos</p>
                    <p className='cart-summary__rightsection__totalprice'>Total: ₡{totalPrice}</p>
                    <button className='cart-summary__rightsection__next' onClick={handleOnNext}>Finalizar Compra</button>
                    {/* <Link className="link-style" to="/product-list">Finalizar Compra</Link> */}
                </div>

            </div>
        </>

    );
}

export default CartComponent;
