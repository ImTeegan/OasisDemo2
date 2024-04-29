import React, { useEffect, useState } from 'react';
import './styles.scss'
import bannerimage from "../../../public/images/banneropc7.png"
import axios from 'axios';
import { Product } from '../../types/types';
import { fetchProducts } from '../../services/fetchProducts';
import { Link } from 'react-router-dom';

const FeaturedProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const fetchedProducts = await fetchProducts();
                setProducts(fetchedProducts);
            } catch (error) {
                console.log('Failed to fetch products', error);
            }
        };

        loadProducts();
    }, []);

    return (
        <>
            <div className='featuredProducts'>
                <div className='featuredProducts__titleButton'>
                    <h3>Los más vendidos</h3>
                    <Link className='link-style' to="/product-list">Ver todos los productos</Link>

                </div>
                <div className='featuredProducts__cards'>
                    {products.slice(0, 4).map(product => (
                        <Link to={`/product-details/${product.id}`} className='featuredProducts__cards__card' key={product.id}>
                            <img src={product.image1} alt="" />
                            <div className='featuredProducts__cards__card__sale'>Más vendido</div>
                            <h2>{product.productName}</h2>
                            <p>₡{product.price}</p>
                            {/* más detalles del producto */}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
};

export default FeaturedProducts;