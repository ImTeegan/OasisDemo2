import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles.scss';
import { useRecoilState } from 'recoil';
import { selectedProductsState } from '../../atoms/cartAtom';
import { userState } from '../../atoms/sessionState';
import trash from '../../../public/icons/trashIcon.png';
import emptycart from '../../../public/images/empty_cart.png';
import axios from 'axios';

const CartComponent = () => {
    const [user, setUser] = useRecoilState(userState);
    const [selectedProducts, setSelectedProducts] = useRecoilState(selectedProductsState);
    const [productsFromBackend, setProductsFromBackend] = useState([]);
    const navigate = useNavigate();
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const fetchCartProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const [productResponse, customProductResponse] = await Promise.all([
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

                const products = productResponse.data.map(item => ({
                    id: item.product.id,
                    productName: item.product.name,
                    description: item.product.description,
                    category: item.product.category,
                    type: 'Product',
                    price: item.product.price,
                    image1: item.product.imageUrl,
                    quantity: item.quantity,
                }));

                const customProducts = customProductResponse.data.map(item => ({
                    id: item.id,
                    productName: "Producto Personalizado",
                    description: item.items.map(i => i.product.name).join(', '),
                    category: "Personalizado",
                    type: "CustomProduct",
                    price: item.totalCost,
                    image1: item.items[0]?.product.imageUrl,
                    quantity: item.quantity,
                }));

                const allProducts = [...products, ...customProducts];
                setProductsFromBackend(allProducts);
                setSelectedProducts(allProducts);
            } catch (error) {
                console.error('Failed to fetch cart products:', error);
            }
        };

        fetchCartProducts();
    }, [setSelectedProducts]);

    useEffect(() => {
        const fetchTotalPrice = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await axios.get('http://localhost:8080/shoppingcart/total', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTotalPrice(response.data);
            } catch (error) {
                console.error('Failed to fetch total price:', error);
            }
        };

        fetchTotalPrice();
    }, [selectedProducts]);

    const handleQuantityChange = async (productId: number, delta: number, productType: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            if (delta === 1) {
                if (productType === 'CustomProduct') {
                    await axios.put(`http://localhost:8080/customProduct/increaseCustomProductQuantity/${productId}`, {}, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                } else {
                    await axios.put(`http://localhost:8080/shoppingcart/increaseProduct/${productId}`, {}, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                }
            } else if (delta === -1) {
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
            }

            // Update the Recoil state
            setSelectedProducts(currentProducts =>
                currentProducts.map(product =>
                    product.id === productId && product.type === productType
                        ? { ...product, quantity: Math.max(1, product.quantity + delta) }
                        : product
                )
            );

            // Update the local state to reflect the changes
            setProductsFromBackend(currentProducts =>
                currentProducts.map(product =>
                    product.id === productId && product.type === productType
                        ? { ...product, quantity: Math.max(1, product.quantity + delta) }
                        : product
                )
            );
        } catch (error) {
            console.error('Failed to change product quantity:', error);
        }
    };

    const handleRemoveProduct = async (productId: number, productType: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            if (productType === 'CustomProduct') {
                await axios.delete(`http://localhost:8080/customProduct/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                await axios.delete(`http://localhost:8080/shoppingcart/removeProduct/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            // Update the Recoil state
            setSelectedProducts(currentProducts =>
                currentProducts.filter(product => product.id !== productId || product.type !== productType)
            );

            // Update the local state to reflect the changes
            setProductsFromBackend(currentProducts =>
                currentProducts.filter(product => product.id !== productId || product.type !== productType)
            );
        } catch (error) {
            console.error('Failed to remove product:', error);
        }
    };

    const handleOnNext = () => {
        navigate('/checkout');
    }

    const totalItems = selectedProducts.reduce((total, product) => total + product.quantity, 0);

    if (selectedProducts.length === 0) {
        return (
            <div className='cart-summary-empty'>
                <div className='empycart'>
                    <img src={emptycart} alt="carrito vacio" />
                    <h3>El carrito está vacío</h3>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className='cart-summary'>
                <div className='cart-summary__cards'>
                    <h2>Carrito de compras</h2>
                    {productsFromBackend.map(product => (
                        <div className='cart-summary__cards__card' key={product.id}>
                            <div className='cart-summary__cards__card__image'>
                                <img src={product.image1} alt={product.productName} />
                            </div>
                            <div className='cart-summary__cards__card__details'>
                                <h4 className='cart-summary__cards__card__name'>{product.productName}</h4>
                                <p className='cart-summary__cards__card__description'>{product.description}</p>
                                <div className='cart-summary__cards__card__quantity-control'>
                                    <button onClick={() => handleQuantityChange(product.id, -1, product.type)}>-</button>
                                    <input aria-label='cantidad' type="text" value={product.quantity} readOnly />
                                    <button onClick={() => handleQuantityChange(product.id, 1, product.type)}>+</button>
                                </div>
                            </div>
                            <div className='cart-summary__cards__card__actions'>
                                <p className='cart-summary__cards__card__price'>₡{product.price}</p>
                                <button aria-label='delete' onClick={() => handleRemoveProduct(product.id, product.type)} className="remove-button">
                                    <img alt='delete' className='imgTrash1' src={trash}></img>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='cart-summary__rightsection'>
                    <p>{totalItems} productos</p>
                    <p className='cart-summary__rightsection__totalprice'>Total: ₡{totalPrice}</p>
                    <button className='cart-summary__rightsection__next' onClick={handleOnNext}>Finalizar Compra</button>
                </div>
            </div>
        </>


    );
}

export default CartComponent;
