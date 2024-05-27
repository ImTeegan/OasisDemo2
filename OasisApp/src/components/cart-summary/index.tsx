import React, { useEffect, useState } from 'react';
import './styles.scss';
import { useRecoilState } from 'recoil';
import { selectedProductsState } from '../../atoms/cartAtom';
import axios from 'axios';

const CartSummary = ({ onNext }: { onNext: () => void }) => {
    const [selectedProducts, setSelectedProducts] = useRecoilState(selectedProductsState);
    const [productsFromBackend, setProductsFromBackend] = useState([]);
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

    const totalItems = selectedProducts.reduce((total, product) => total + product.quantity, 0);

    return (
        <>
            <div className='crumb-path1'>
                <div>
                    <strong>Carrito</strong>  <span>Información de envío</span>  <span>Información de pago</span>
                </div>
            </div>
            <div className='cart-summary1'>
                <div className='cart-summary__cards'>
                    <h2>Resumen</h2>
                    {productsFromBackend.map(product => (
                        <div className='cart-summary__cards__card' key={product.id}>
                            <div className='cart-summary__cards__card__image'>
                                <img src={product.image1} alt={product.productName} />
                            </div>
                            <div>
                                <div className='headerp'>
                                    <h4 className='pname'>{product.productName}</h4>
                                    <p className='pricep'> ₡{product.price}</p>
                                </div>
                                <p> {product.description}</p>
                                <div className='headerp'>
                                    <p>Cantidad: {product.quantity}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='cart-summary__rightsection'>
                    <p>{totalItems} productos</p>
                    <p className='cart-summary__rightsection__totalprice'>Total: ₡{totalPrice}</p>
                    <button className='cart-summary__rightsection__next' onClick={onNext}>Siguiente</button>
                </div>
            </div>
        </>
    );
}

export default CartSummary;
