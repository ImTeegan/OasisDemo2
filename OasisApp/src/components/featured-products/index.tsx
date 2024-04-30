import React, { useEffect, useState } from 'react';
import './styles.scss';
import { Link } from 'react-router-dom';
import { Product } from '../../types/types';
import { fetchProducts } from '../../services/fetchProducts';

const FeaturedProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const fetchedProducts = await fetchProducts();
                // Solo cargar los primeros 6 productos para el carrusel
                setProducts(fetchedProducts.slice(0, 6));
            } catch (error) {
                console.error('Failed to fetch products', error);
            }
        };
        loadProducts();
    }, []);

    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const handleNextClick = () => {
        // Previene avanzar el índice más allá del punto donde se pueden mostrar menos de 3 productos
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, products.length - 3));
    };

    return (
        <>
            <div className='featuredProducts'>
                <div className='featuredProducts__titleButton'>
                    <h3>Los más vendidos</h3>
                    <Link className='link-style' to="/product-list">Ver todos los productos</Link>
                </div>
                <div className='carousel-container'>
                    <button onClick={handlePrevClick} disabled={currentIndex === 0}>&lt;</button>
                    <div className='featuredProducts__cards' style={{ transform: `translateX(-${currentIndex * 100 / 3}%)` }}>
                        {products.map((product, index) => (
                            <div className='featuredProducts__cards__card' key={product.id} style={{ backgroundImage: `url(${product.image1})` }}>
                                <Link className='Linkito' to={`/product-details/${product.id}`}>
                                    <div className='featuredProducts__cards__card__sale'>Más vendido</div>
                                    <div className='card-content'>
                                        <h2 className='tituloCard'>{product.productName}</h2>
                                        <p className='descCard'>{product.description}</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleNextClick} disabled={currentIndex >= products.length - 3}>&gt;</button>
                </div>
            </div>
        </>
    );
};

export default FeaturedProducts;
