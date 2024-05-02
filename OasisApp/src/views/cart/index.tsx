import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/types';
import { fetchProducts } from '../../services/fetchProducts';
import './styles.scss';
import './styles.scss';
import CartSummary from '../../components/cart-summary';
import ShippingForm from '../../components/shipping-form';
import PaymentForm from '../../components/payment-form';
import CartComponent from '../../components/cart';

const Cart = () => {


    return (
        <div>
            <div>
                <CartComponent />
            </div>
        </div>
    );
}

export default Cart;