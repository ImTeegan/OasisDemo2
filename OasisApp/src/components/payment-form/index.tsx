// src/components/PaymentForm/PaymentForm.tsx

import './styles.scss';
import React, { useState } from 'react';
import visaLogo from '../../../public/images/visalogo.png';
import mastercardLogo from '../../../public/images/mastercardlogo.png';
import amexLogo from '../../../public/images/aelogo.png';

const PaymentForm = ({ onPurchase, onPrevious }: { onPurchase: () => void, onPrevious: () => void }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [cardType, setCardType] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [errors, setErrors] = useState({});

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

        if (!expiryDate || !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiryDate)) {
            errors.expiryDate = "Invalid date format, expected MM/YY";
            isValid = false;
        }

        if (!cvv || (validateCardNumber(cardNumber) === 'AMEX' ? cvv.length !== 4 : cvv.length !== 3)) {
            errors.cvv = "Invalid CVV";
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const handleSubmit = () => {
        if (validate()) {
            onPurchase();
        }
    };

    const handleCardNumberChange = (e) => {
        const number = e.target.value;
        setCardNumber(number);
        setCardType(getCardType(number));
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
        <div className='paymentForm'>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="card-number-input">
                    <input type="text" value={cardNumber} onChange={handleCardNumberChange} placeholder="Card Number" />
                    <div className="card-logo">
                        {cardType === 'Visa' && <img src={visaLogo} alt="Visa" />}
                        {cardType === 'MasterCard' && <img src={mastercardLogo} alt="MasterCard" />}
                        {cardType === 'AMEX' && <img src={amexLogo} alt="American Express" />}
                    </div>
                </div>

                <input type="text" value={cardHolder} onChange={e => setCardHolder(e.target.value)} placeholder="Card Holder" />
                <input type="text" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} placeholder="MM/YY" />
                <input type="text" value={cvv} onChange={e => setCvv(e.target.value)} placeholder="CVV" />
                {Object.keys(errors).map(key => (
                    <p key={key} style={{ color: 'red' }}>{errors[key]}</p>
                ))}
                <button onClick={onPrevious}>Previous</button>
                <button onClick={handleSubmit}>Purchase</button>
            </form>
        </div>
    );
};

export default PaymentForm;
