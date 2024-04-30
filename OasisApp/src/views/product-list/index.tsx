
import './styles.scss';
import BannerComponent from '../../components/heroBanner';

import ProductListComponent from '../../components/product-list';

const ProductList = () => {


    return (
        <div>
            <BannerComponent title="Productos" subtitle="Para regalar felicidad" />
            <ProductListComponent />
        </div>
    );
}

export default ProductList;