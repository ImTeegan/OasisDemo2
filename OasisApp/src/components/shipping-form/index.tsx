// src/components/ShippingForm/ShippingForm.tsx
import React, { useEffect, useState } from 'react';
import './styles.scss'

const ShippingForm = ({ onNext, onPrevious, shippingData, setShippingData }) => {
    const [error, setError] = useState('');

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
        <div className='shippingForm'>
            <form onSubmit={(e) => e.preventDefault()}>
                <label>Dirección 1:* </label>
                <input type="text" name="address1" value={shippingData.address1} onChange={handleChange} required />

                <label>Dirección 2:</label>
                <input type="text" name="address2" value={shippingData.address2} onChange={handleChange} />

                <label>Ciudad:* </label>
                <input type="text" name="city" value={shippingData.city} onChange={handleChange} required />

                <label>Provincia:* </label>
                <select name="province" value={shippingData.province} onChange={handleChange} required>
                    <option value="">Seleccione una provincia</option>
                    {provinces.map(province => (
                        <option key={province} value={province}>{province}</option>
                    ))}
                </select>

                <label>Código Postal:* </label>
                <input type="text" name="zipCode" value={shippingData.zipCode} onChange={handleChange} required />

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div>
                    <button type="button" onClick={onPrevious}>Anterior</button>
                    <button type="button" onClick={handleNextClick}>Siguiente</button>
                </div>
            </form>
        </div>
    );
};


export default ShippingForm;
