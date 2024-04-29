import React from 'react';
import './styles.scss';
import HeroHome from '../../components/hero-home';
import FeaturedProducts from '../../components/featured-products';

const Home = () => {
    return (
        <div>
            <HeroHome/>
            <FeaturedProducts/>
        </div>
    );
}

export default Home;