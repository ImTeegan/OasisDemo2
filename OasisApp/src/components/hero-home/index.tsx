import React, { useState } from 'react';
import './styles.scss'
import bannerimage from "../../../public/images/banneropc8.jpg"
import bannerimage1 from "../../../public/images/banneropc7.png"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const HeroHome: React.FC = () => {

    const navigate = useNavigate();

    const goToProductList = () => {
        navigate('/product-list');
    };

    return (
        <section className="hero">
            <img src={bannerimage} alt="Banner decorativo de flores" className="image-hero" />
            <div className="hero-content">
                <h2 className="title-home">Dilo con Flores</h2>
                <p className="frase-home">Descubre nuestras creaciones florales hoy mismo</p>
                <button onClick={goToProductList} className="shop-now">Descubrir</button>
            </div>
        </section>

    );
};

export default HeroHome;
