import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../../types/types';
import { CustomItem } from '../../types/types';
import { WrappingPaper } from '../../types/types';
import { Follaje } from '../../types/types';
import { fetchProducts } from '../../services/fetchProducts';
import { fetchCustomItems } from '../../services/fetchProducts';
import { fetchWrappingPaper } from '../../services/fetchProducts';
import { fetchFollaje } from '../../services/fetchProducts';
import './styles.scss';
import { useRecoilState } from 'recoil';
import { selectedProductsState } from '../../atoms/cartAtom';
import { userState } from '../../atoms/sessionState';

const CustomProduct = () => {
    const [flowers, setFlowers] = useState<CustomItem[]>([]);
    const [paper, setPaper] = useState<CustomItem[]>([]);
    const [follaje, setFollaje] = useState<CustomItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<CustomItem[]>([]);
    const [total, setTotal] = useState(0);
    const [selectedProducts, setSelectedProducts] = useRecoilState(selectedProductsState);
    const [flowerCount, setFlowerCount] = useState(0);
    const [paperCount, setPaperCount] = useState(0);
    const [follajeCount, setFollajeCount] = useState(0);
    const [customItems, setCustomItems] = useState<CustomItem[]>([]);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [user, setUser] = useRecoilState(userState);
    const navigate = useNavigate();

    useEffect(() => {
        const loadCustomProducts = async () => {
            try {
                const fetchedCustomsItems = await fetchCustomItems();

                setCustomItems(fetchedCustomsItems);

            } catch (error) {
                console.log('Failed to fetch products', error);
            }

        };

        loadCustomProducts();
    }, []);

    const handleSelectItem = (item: CustomItem) => {
        let canAddItem = false;
        switch (item.tipo) {
            case 'flor':
                if (flowerCount < 3) {
                    setFlowerCount(flowerCount + 1);
                    canAddItem = true;
                }
                break;
            case 'papel':
                if (paperCount < 2) {
                    setPaperCount(paperCount + 1);
                    canAddItem = true;
                }
                break;
            case 'follaje':
                if (follajeCount < 2) {
                    setFollajeCount(follajeCount + 1);
                    canAddItem = true;
                }
                break;
            default:
                break;
        }

        if (canAddItem) {
            setSelectedItems(currentItems => [...currentItems, item]);
            setTotal(currentTotal => currentTotal + item.precio);
            setNotificationMessage(`${item.nombre} agregado a tu ramo personalizado.`);
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 5000);
        }


    };

    const handleRemoveItem = (item: CustomItem, index: number) => {
        setSelectedItems(currentItems => currentItems.filter((_, i) => i !== index));
        setTotal(currentTotal => currentTotal - item.precio);

        switch (item.tipo) {
            case 'flor':
                setFlowerCount(flowerCount - 1);
                break;
            case 'papel':
                setPaperCount(paperCount - 1);
                break;
            case 'follaje':
                setFollajeCount(follajeCount - 1);
                break;
            default:
                break;
        }
    };

    const isSelectable = (itemType: string) => {
        switch (itemType) {
            case 'flor':
                return flowerCount < 3;
            case 'papel':
                return paperCount < 2;
            case 'follaje':
                return follajeCount < 2;
            default:
                return false;
        }
    };

    const createCustomProduct = () => {
        if (!user.isLoggedIn) {
            // Si no está logueado, redirige al login
            navigate('/login');
            return;
        }

        if (flowerCount < 1 || paperCount < 1 || follajeCount < 1) {
            alert("Debe seleccionar al menos una flor, un papel y un follaje.");
            return;
        }

        const description = selectedItems.map(item => item.nombre).join(', ');
        const newProduct = {
            id: selectedProducts.length > 0 ? Math.max(...selectedProducts.map(p => p.id)) + 1 : 1,
            productName: "Producto Personalizado",
            category: "Personalizado",
            price: total,
            image1: selectedItems[0]?.imagen, // Toma la imagen del primer ítem
            image2: "https://example.com/image2.jpg",
            image3: "https://example.com/image3.jpg",
            description: `Contiene: ${description}`,
            quantity: 1,
        };
        setSelectedProducts([...selectedProducts, newProduct]);

        setNotificationMessage("Producto agregado al carrito");
        setShowNotification(true);

        setTimeout(() => {
            setShowNotification(false);
        }, 5000);
    };


    return (
        <div className='containerMain'>
            <div className="product-container">
                <h2>Flores</h2>
                <div className="customCards">
                    {customItems.filter(item => item.tipo === 'flor').map(flower => (
                        <div key={flower.id} className={`customCards__customCard ${isSelectable('flor') ? '' : 'disabled'}`}>
                            <img src={flower.imagen} alt={flower.nombre} />
                            <div className='data-custom-product'>
                                <h3>{flower.nombre}</h3>
                                <p>₡{flower.precio}</p>
                            </div>
                            <button className='add-Button' onClick={() => handleSelectItem(flower)} disabled={!isSelectable('flor')}>Elegir</button>
                        </div>
                    ))}
                </div>

                <h2>Papel de Envoltura</h2>
                <div className="customCards">
                    {customItems.filter(item => item.tipo === 'papel').map(paper => (
                        <div key={paper.id} className={`customCards__customCard ${isSelectable('papel') ? '' : 'disabled'}`}>
                            <img src={paper.imagen} alt={paper.nombre} />
                            <div className='data-custom-product'>
                                <h3>{paper.nombre}</h3>
                                <p>₡{paper.precio}</p>
                            </div>

                            <button className='add-Button' onClick={() => handleSelectItem(paper)}>Elegir</button>
                        </div>
                    ))}
                </div>

                <h2>Follaje</h2>
                <div className="customCards">
                    {customItems.filter(item => item.tipo === 'follaje').map(follaje => (
                        <div key={follaje.id} className={`customCards__customCard ${isSelectable('follaje') ? '' : 'disabled'}`}>
                            <img src={follaje.imagen} alt={follaje.nombre} />
                            <div className='data-custom-product'>
                                <h3>{follaje.nombre}</h3>
                                <p>₡{follaje.precio}</p>
                            </div>

                            <button className='add-Button' onClick={() => handleSelectItem(follaje)}>Elegir</button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="selected-items">
                <h2>Elementos seleccionados</h2>
                {selectedItems.map((item, index) => (
                    <div className="item-card" key={index}>
                        <button className="item-card__remove" onClick={() => handleRemoveItem(item, index)}>x</button>
                        <img className='item-card__img' src={item.imagen} alt={item.nombre} />
                        <div className="item-card__info">
                            <p>{item.nombre} - ₡{item.precio}</p>
                            <h6>{item.tipo}</h6>
                        </div>
                    </div>
                ))}
                <h3>Total: ₡{total}</h3>
                <button onClick={createCustomProduct}>Agregar al carrito</button>
                <div className={`notificationMessage ${showNotification ? 'show' : ''}`}>
                    {notificationMessage}
                </div>
            </div>


        </div>

    );
}

export default CustomProduct;


