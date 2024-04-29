import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/types';
import { fetchProducts } from '../../services/fetchProducts';
import './styles.scss';
import { useRecoilState } from 'recoil';
import { selectedProductsState } from '../../atoms/cartAtom';

const CartSummary = ({ onNext }: { onNext: () => void }) => {
    const [selectedProducts, setSelectedProducts] = useRecoilState(selectedProductsState);

    return (
        <div>
            {selectedProducts.map(product => (
                <div key={product.id}>
                    <img src={product.image1} className='imgproductcart' />
                    <h4>{product.productName}</h4>
                    <p>Cantidad: {product.quantity}</p>
                    <p>Precio: ₡{product.price}</p>
                </div>
            ))}
            <button onClick={onNext}>Siguiente</button>
        </div>
    );

}

export default CartSummary;