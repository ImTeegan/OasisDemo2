import React, { useState } from 'react';
import './styles.scss'
import bannerimage from "../../../public/images/banneropc7.png"
import axios from 'axios';


const HeroHome: React.FC = () => {

    return (
        <section className="hero">
            <div className="hero-grid">
                <div className="hero-item">
                    <h2 className="title-home">Dilo con Flores</h2>
                    <p className="frase-home">Descubre nuestras creaciones florales hoy mismo</p>
                    <img className="image-hero" src={bannerimage} alt="Imagen 1" />
                    <button className="shop-now">Descubrir</button>
                </div>
            </div>
        </section>
    );
};

export default HeroHome;
