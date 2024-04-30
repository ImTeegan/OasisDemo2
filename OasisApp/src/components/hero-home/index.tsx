import React, { useState } from 'react';
import './styles.scss'
import bannerimage from "../../../public/images/banneropc8.jpg"
import bannerimage1 from "../../../public/images/banneropc7.png"
import axios from 'axios';


const HeroHome: React.FC = () => {

    return (
        <section className="hero">
            <img src={bannerimage} alt="Banner decorativo de flores" className="image-hero" />
            <div className="hero-content">
                <h2 className="title-home">Dilo con Flores</h2>
                <p className="frase-home">Descubre nuestras creaciones florales hoy mismo</p>
                <button className="shop-now">Descubrir</button>
            </div>
        </section>

    );
};

export default HeroHome;
