import React from 'react';
import './styles.scss';
import HeroHome from '../../components/hero-home';
import FeaturedProducts from '../../components/featured-products';
import CustomProduct from '../../components/custom-product';
import BannerComponent from '../../components/heroBanner';


const Create = () => {
    return (
        <div>
            <BannerComponent title="Ramo Personalizado" subtitle="Para regalar felicidad" />
            <CustomProduct />
        </div>
    );
}

export default Create;