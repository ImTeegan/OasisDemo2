// src/components/ShippingForm/ShippingForm.tsx
import React, { useEffect, useState } from 'react';
import './styles.scss'
import { useRecoilState } from 'recoil';
import { selectedProductsState } from '../../atoms/cartAtom';

const ShippingForm = ({ onNext, onPrevious, shippingData, setShippingData }) => {
    const [error, setError] = useState('');
    const [selectedProducts, setSelectedProducts] = useRecoilState(selectedProductsState);

    const totalPrice = selectedProducts.reduce((acc, product) => acc + product.price * product.quantity, 0);
    const totalItems = selectedProducts.reduce((total, product) => total + product.quantity, 0);


    const provinces = ["San José", "Alajuela", "Cartago", "Heredia", "Guanacaste", "Puntarenas", "Limón"];

    const validateForm = () => {
        if (!shippingData.address1 || !shippingData.city || !shippingData.province || !shippingData.zipCode) {
            setError('Por favor, complete todos los campos requeridos.');
            return false;
        }
        if (!/^\d{5}$/.test(shippingData.zipCode)) { // Valida que el código postal sea exactamente 5 dígitos
            setError('El código postal debe ser un número de 5 dígitos.');
            return false;
        }
        setError(''); // Limpiar errores previos si todo está correcto
        return true;
    };

    const handleNextClick = () => {
        if (validateForm()) {
            onNext(); // Solo avanza si la validación es exitosa
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setShippingData(prev => ({ ...prev, [name]: value }));
        if (error) validateForm(); // Revalidar mientras el usuario corrige errores
    };

    return (
        <>
            <div className='crumb-path'>
                <div>
                    <span>Carrito</span>  <strong>Información de envío</strong>  <span>Información de pago</span>
                </div>
                <p>Total: {'('}{totalItems} productos{')'} ₡{totalPrice}</p>
            </div>
            <div className='shipping-form'>

                <h2 className='titleshipping'>Información de envío</h2>
                <form onSubmit={(e) => e.preventDefault()} className="form">
                    <div className="form-group">
                        <label htmlFor="address1">Dirección 1:*</label>
                        <input type="text" id="address1" name="address1" value={shippingData.address1} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address2">Dirección 2:</label>
                        <input type="text" id="address2" name="address2" value={shippingData.address2} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="city">Ciudad:*</label>
                        <input type="text" id="city" name="city" value={shippingData.city} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="province">Provincia:*</label>
                        <select id="province" name="province" value={shippingData.province} onChange={handleChange} required>
                            <option value="">Seleccione una provincia</option>
                            {provinces.map(province => (
                                <option key={province} value={province}>{province}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="zipCode">Código Postal:*</label>
                        <input type="text" id="zipCode" name="zipCode" value={shippingData.zipCode} onChange={handleChange} required />
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <div className="form-actions">
                        <button type="button" className="button button-previous" onClick={onPrevious}>Anterior</button>
                        <button type="button" className="button button-next" onClick={handleNextClick}>Siguiente</button>
                    </div>
                </form>
            </div>

        </>

    );
};


export default ShippingForm;
