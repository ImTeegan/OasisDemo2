// BannerComponent.tsx
import React from 'react';
import './styles.scss';
import bannerImage from '../../../public/images/bannerImage.jpg'; // Asegúrate de reemplazar con la ruta correcta a tu imagen

interface BannerComponentProps {
    title: string;
    subtitle: string;
}

const BannerComponent: React.FC<BannerComponentProps> = ({ title, subtitle }) => {
    return (
        <div className="banner">
            <div className="banner-content">
                <h1>{title}</h1>
                <p>{subtitle}</p>
            </div>
        </div>
    );
};

export default BannerComponent;
