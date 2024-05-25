import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/types';
import { fetchProducts } from '../../services/fetchProducts';
import './styles.scss';
import './styles.scss';
import CartSummary from '../../components/cart-summary';
import ShippingForm from '../../components/shipping-form';
import PaymentForm from '../../components/payment-form';

const Checkout = () => {
    const [step, setStep] = useState(1);
    const [shippingData, setShippingData] = useState({
        address1: '',
        address2: '',
        city: '',
        province: '',
        zipCode: ''
    });
    const [paymentData, setPaymentData] = useState({
        paymentMethod: ''
    });

    const handleNext = () => {
        setStep(step + 1);
    };

    const handlePrevious = () => {
        setStep(step - 1);
    };

    return (
        <div>
            <div>
                {step === 1 && <CartSummary onNext={handleNext} />}
                {step === 2 && <ShippingForm onNext={handleNext} onPrevious={handlePrevious} shippingData={shippingData} setShippingData={setShippingData} />}
                {step === 3 && <PaymentForm onPrevious={handlePrevious} shippingData={shippingData} />}
            </div>
        </div>
    );
}

export default Checkout;
