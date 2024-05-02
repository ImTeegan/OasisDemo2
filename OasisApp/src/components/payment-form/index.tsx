// src/components/PaymentForm/PaymentForm.tsx

import './styles.scss';
import React, { useState } from 'react';
import visaLogo from '../../../public/images/visalogo.png';
import mastercardLogo from '../../../public/images/mastercardlogo.png';
import amexLogo from '../../../public/images/aelogo.png';
import { useRecoilState } from 'recoil';
import { selectedProductsState } from '../../atoms/cartAtom';
import ThreeDots from '../../../public/svg-animations/three-dots.svg';
import Check from '../../../public/svg-animations/checkc.svg';
import { useNavigate } from 'react-router-dom';
import { useResetRecoilState } from 'recoil';




const PaymentForm = ({ onPurchase, onPrevious }: { onPurchase: () => void, onPrevious: () => void }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [cardType, setCardType] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiryMonth, setExpiryMonth] = useState('');
    const [expiryYear, setExpiryYear] = useState('');
    const [cvv, setCvv] = useState('');
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const [selectedProducts, setSelectedProducts] = useRecoilState(selectedProductsState);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [showThankYouModal, setShowThankYouModal] = useState(false);

    const navigate = useNavigate();
    const resetCart = useResetRecoilState(selectedProductsState);



    const totalPrice = selectedProducts.reduce((acc, product) => acc + product.price * product.quantity, 0);
    const totalItems = selectedProducts.reduce((total, product) => total + product.quantity, 0);

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const validateCardNumber = (number) => {
        const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
        const mastercardRegex = /^5[1-5][0-9]{14}$/;
        const amexRegex = /^3[47][0-9]{13}$/;

        if (visaRegex.test(number)) return 'Visa';
        if (mastercardRegex.test(number)) return 'MasterCard';
        if (amexRegex.test(number)) return 'AMEX';
        return false;
    };

    const validate = () => {
        let isValid = true;
        let errors = {};

        if (!cardNumber || validateCardNumber(cardNumber) === false) {
            errors.cardNumber = "Invalid card number";
            isValid = false;
        }

        if (!cardHolder) {
            errors.cardHolder = "Card holder name is required";
            isValid = false;
        }

        if (!expiryMonth || !expiryYear) {
            errors.expiryDate = "Expiry date is required";
            isValid = false;
        } else if (parseInt(expiryYear) < currentYear || (parseInt(expiryYear) === currentYear && parseInt(expiryMonth) < currentMonth)) {
            // Si el año de expiración es menor que el año actual, o si el año es el mismo pero el mes de expiración es anterior al mes actual
            errors.expiryDate = "The card has expired";
            isValid = false;
        }

        if (!cvv || (validateCardNumber(cardNumber) === 'AMEX' ? cvv.length !== 4 : cvv.length !== 3)) {
            errors.cvv = "Invalid CVV";
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: Check,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    const handleSubmit = async () => {
        if (validate()) {
            console.log("Validación pasada, mostrando modal...");
            setShowLoadingModal(true);
            setTimeout(() => {
                setShowLoadingModal(false);
                setShowThankYouModal(true);
                setTimeout(() => {
                    setShowThankYouModal(false);
                    resetCart();
                    navigate('/');
                }, 5000);
            }, 5000);
        }
    };

    const handleCardNumberChange = (e) => {
        let { value } = e.target;
        value = value.replace(/\D/g, ''); // Elimina cualquier caracter no numérico
        value = value.substring(0, 16); // Limita la longitud a 16 números

        // Añade un espacio cada 4 números
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');

        setCardNumber(value);
        setCardType(getCardType(value.replace(/\s+/g, ''))); // Elimina espacios antes de determinar el tipo
    };


    const getCardType = (number) => {
        const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
        const mastercardRegex = /^5[1-5][0-9]{14}$/;
        const amexRegex = /^3[47][0-9]{13}$/;

        if (visaRegex.test(number)) return 'Visa';
        if (mastercardRegex.test(number)) return 'MasterCard';
        if (amexRegex.test(number)) return 'AMEX';
        return '';
    };

    return (

        <>
            <div className='crumb-path'>
                <div>
                    <span>Carrito</span>  <span>Información de envío</span>  <strong>Información de pago</strong>
                </div>
                <p>Total: {'('}{totalItems} productos{')'} ₡{totalPrice}</p>
            </div>
            <div className='payment-form'>
                <form onSubmit={(e) => e.preventDefault()} className="form">
                    <h2>Información de pago</h2>
                    <div className="form-group">
                        <input type="text" value={cardNumber} onChange={handleCardNumberChange} placeholder="Número de Tarjeta" className="input-field" maxLength="19" />
                        <div className="card-logo">
                            {cardType === 'Visa' && <img src={visaLogo} alt="Visa" />}
                            {cardType === 'MasterCard' && <img src={mastercardLogo} alt="MasterCard" />}
                            {cardType === 'AMEX' && <img src={amexLogo} alt="American Express" />}
                        </div>
                    </div>

                    <div className="form-group">
                        <input type="text" value={cardHolder} onChange={e => setCardHolder(e.target.value)} placeholder="Nombre en la Tarjeta" className="input-field" />
                    </div>

                    <div className="form-group expiry-group">
                        <select aria-label='mes' className="input-field" value={expiryMonth} onChange={e => setExpiryMonth(e.target.value)}>
                            <option value="">Mes</option>
                            {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                        <select aria-label='año' className="input-field" value={expiryYear} onChange={e => setExpiryYear(e.target.value)}>
                            <option value="">Año</option>
                            {[...Array(12)].map((_, i) => (
                                <option key={2024 + i} value={2024 + i}>{2024 + i}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <input type="text" value={cvv} onChange={e => setCvv(e.target.value)} placeholder="CVV" className="input-field" />
                    </div>

                    {Object.keys(errors).map(key => (
                        <p key={key} className="error-message">{errors[key]}</p>
                    ))}

                    <div className="form-actions">
                        <button className="button button-previous" onClick={onPrevious}>Anterior</button>
                        <button className="button button-submit" onClick={handleSubmit}>Comprar</button>
                        {showLoadingModal && (
                            <div className="modal">
                                <div className="modal-content">
                                    <img src={ThreeDots} alt="cargando" />
                                    <p>Estamos procesando tu pago...</p>
                                </div>
                            </div>
                        )}

                        {showThankYouModal && (
                            <div className="modal">
                                <div className="modal-content">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="check">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>

                                    <p>Muchas gracias por tu compra!</p>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </>

    );
};

export default PaymentForm;
