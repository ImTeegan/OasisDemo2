
import './styles.scss';
import { useRecoilState } from 'recoil';
import { selectedProductsState } from '../../atoms/cartAtom';



const CartSummary = ({ onNext }: { onNext: () => void }) => {
    const [selectedProducts, setSelectedProducts] = useRecoilState(selectedProductsState);

    const totalPrice = selectedProducts.reduce((acc, product) => acc + product.price * product.quantity, 0);
    const totalItems = selectedProducts.reduce((total, product) => total + product.quantity, 0);

    return (
        <>
            <div className='crumb-path1'>
                <div>
                    <strong>Carrito</strong>  <span>Información de envío</span>  <span>Información de pago</span>
                </div>

            </div>
            <div className='cart-summary1'>

                <div className='cart-summary__cards'>
                    <h2>Resumen</h2>
                    {selectedProducts.map(product => (
                        <div className='cart-summary__cards__card' key={product.id}>
                            <div>
                                <img src={product.image1} alt={product.productName} />
                            </div>
                            <div>
                                <div className='headerp'>
                                    <h4 className='pname'>{product.productName}</h4>
                                    <p className='pricep'> ₡{product.price}</p>
                                </div>
                                <p> {product.description}</p>

                                <div className='headerp'>
                                    <p>Cantidad: {product.quantity}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='cart-summary__rightsection'>
                    <p>{totalItems} productos</p>
                    <p className='cart-summary__rightsection__totalprice'>Total: ₡{totalPrice}</p>
                    <button className='cart-summary__rightsection__next' onClick={onNext}>Siguiente</button>
                </div>

            </div>
        </>

    );
}

export default CartSummary;
