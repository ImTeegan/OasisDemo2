import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CustomItem } from '../../types/types';
import './styles.scss';
import { useRecoilState } from 'recoil';
import { selectedProductsState } from '../../atoms/cartAtom';
import { userState } from '../../atoms/sessionState';
import { customProductIdState, editCustomProduct } from '../../atoms/customProductAtom';
import axios from 'axios';

const CustomProduct = () => {
    const [flowers, setFlowers] = useState<CustomItem[]>([]);
    const [wrappingPaper, setWrappingPaper] = useState<CustomItem[]>([]);
    const [foliage, setFoliage] = useState<CustomItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<CustomItem[]>([]);
    const [total, setTotal] = useState(0);
    const [selectedProducts, setSelectedProducts] = useRecoilState(selectedProductsState);
    const [flowerCount, setFlowerCount] = useState(0);
    const [paperCount, setPaperCount] = useState(0);
    const [foliageCount, setFoliageCount] = useState(0);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [user, setUser] = useRecoilState(userState);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [customProductId, setCustomProductId] = useRecoilState(customProductIdState);
    const [editCustom, setEditCustomProduct] = useRecoilState(editCustomProduct);
    const [customProductName, setCustomProductName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setEditCustomProduct(false);
        const loadCustomProducts = async () => {
            try {
                const [fetchedFlowers, fetchedWrappingPaper, fetchedFoliage] = await Promise.all([
                    axios.get('http://localhost:8080/products/getAllFlowerItem'),
                    axios.get('http://localhost:8080/products/getAllPaperItem'),
                    axios.get('http://localhost:8080/products/getAllFoliageItem')
                ]);

                setFlowers(fetchedFlowers.data);
                setWrappingPaper(fetchedWrappingPaper.data);
                setFoliage(fetchedFoliage.data);
            } catch (error) {
                console.error('Failed to fetch products', error);
            }
        };

        loadCustomProducts();
    }, []);

    useEffect(() => {
        const fetchSelectedItems = async () => {
            if (!customProductId) return;

            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await axios.get(`http://localhost:8080/customProduct/${customProductId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const customProduct = response.data;

                const items = customProduct.items.map((item) => item.product);
                setSelectedItems(items);
                setTotal(customProduct.totalCost);
                setFlowerCount(customProduct.flowerCount);
                setPaperCount(customProduct.paperCount);
                setFoliageCount(customProduct.foliageCount);
            } catch (error) {
                console.error('Failed to fetch custom product items:', error);
            }
        };

        const fetchWishlistCustomProduct = async () => {
            if (!customProductId) return;

            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await axios.get('http://localhost:8080/customProduct/wishList', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const wishlistCustomProducts = response.data;
                const customProduct = wishlistCustomProducts.find(cp => cp.id === customProductId);

                if (customProduct) {
                    const items = customProduct.items.map(item => item.product);

                    const selectedItemsFromWishlist = items.map(item => {
                        const categoryItem = [...flowers, ...wrappingPaper, ...foliage].find(
                            p => p.id === item.id
                        );
                        if (categoryItem) {
                            return categoryItem;
                        }
                        return item;
                    });

                    setSelectedItems(selectedItemsFromWishlist);
                    setTotal(customProduct.totalCost);
                    setFlowerCount(customProduct.flowerCount);
                    setPaperCount(customProduct.paperCount);
                    setFoliageCount(customProduct.foliageCount);
                    setEditCustomProduct(false);
                }
            } catch (error) {
                console.error('Failed to fetch wishlist custom products:', error);
            }
        };

        fetchSelectedItems();
        fetchWishlistCustomProduct();
    }, [customProductId, flowers, wrappingPaper, foliage]);

    const Modal = ({ isOpen, onClose, message }) => {
        if (!isOpen) return null;

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <p>{message}</p>
                    <button onClick={onClose}>OK</button>
                </div>
            </div>
        );
    };

    const handleSelectItem = async (item: CustomItem) => {
        let canAddItem = false;
        switch (item.category) {
            case 'Flor':
                if (flowerCount < 3) {
                    setFlowerCount(flowerCount + 1);
                    canAddItem = true;
                }
                break;
            case 'Papel':
                if (paperCount < 2) {
                    setPaperCount(paperCount + 1);
                    canAddItem = true;
                }
                break;
            case 'Follaje':
                if (foliageCount < 2) {
                    setFoliageCount(foliageCount + 1);
                    canAddItem = true;
                }
                break;
            default:
                break;
        }

        if (canAddItem) {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                await axios.post('http://localhost:8080/customProduct/addItem', {
                    customProductId,
                    productId: item.id
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setSelectedItems(currentItems => [...currentItems, item]);
                setTotal(currentTotal => currentTotal + item.price);
                setNotificationMessage(`${item.name} agregado a tu ramo personalizado.`);
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 5000);
            } catch (error) {
                console.error('Failed to add item to custom product:', error);
            }
        }
    };

    const handleRemoveItem = async (item: CustomItem, index: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await axios.delete(`http://localhost:8080/customProduct/${customProductId}/removeItem/${item.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setSelectedItems(currentItems => currentItems.filter((_, i) => i !== index));
            setTotal(currentTotal => currentTotal - item.price);

            switch (item.category) {
                case 'Flor':
                    setFlowerCount(flowerCount - 1);
                    break;
                case 'Papel':
                    setPaperCount(paperCount - 1);
                    break;
                case 'Follaje':
                    setFoliageCount(foliageCount - 1);
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error('Failed to remove item from custom product:', error);
        }
    };

    const isSelectable = (itemType: string) => {
        switch (itemType) {
            case 'Flor':
                return flowerCount < 3;
            case 'Papel':
                return paperCount < 2;
            case 'Follaje':
                return foliageCount < 2;
            default:
                return false;
        }
    };

    const handleChangeContextType = async (newContextType: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            console.log(customProductId, newContextType, customProductName);

            await axios.put(`http://localhost:8080/customProduct/${customProductId}/changeContextType?newContextType=${newContextType}&name=${customProductName}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (newContextType === 'SHOPPINGCART') {
                const description = selectedItems.map(item => item.name).join(', ');
                const newProduct = {
                    id: selectedProducts.length > 0 ? Math.max(...selectedProducts.map(p => p.id)) + 1 : 1,
                    productName: "Producto Personalizado",
                    category: "Personalizado",
                    price: total,
                    image1: selectedItems[0]?.imageUrl,
                    image2: "https://example.com/image2.jpg",
                    image3: "https://example.com/image3.jpg",
                    description: `Contiene: ${description}`,
                    quantity: 1,
                };
                setSelectedProducts([...selectedProducts, newProduct]);
            }

            setNotificationMessage(`Producto agregado a ${newContextType === 'SHOPPINGCART' ? 'carrito' : 'lista de deseos'}`);
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
                setCustomProductId(null);
                window.location.reload();
            }, 5000);

        } catch (error) {
            console.error(`Failed to change context type to ${newContextType}:`, error);
        }
    };

    const createCustomProduct = (newContextType: string) => {
        if (!user.isLoggedIn) {
            navigate('/login');
            return;
        }

        if (flowerCount < 1 || paperCount < 1 || foliageCount < 1 || !customProductName) {
            setModalMessage("Debe seleccionar al menos una flor, un papel y un follaje, y proporcionar un nombre para el producto.");
            setShowModal(true);
            return;
        }

        handleChangeContextType(newContextType);
    };

    return (
        <div className='containerMain'>
            <div className="product-container">
                <h2>Flores</h2>
                <div className="customCards">
                    {flowers.map(flower => (
                        <div key={flower.id} className={`customCards__customCard ${isSelectable('Flor') ? '' : 'disabled'}`}>
                            <img src={flower.imageUrl} alt={flower.name} />
                            <div className='data-custom-product'>
                                <h3>{flower.name}</h3>
                                <p>₡{flower.price}</p>
                            </div>
                            <button className='add-Button' onClick={() => handleSelectItem(flower)} disabled={!isSelectable('Flor')}>Elegir</button>
                        </div>
                    ))}
                </div>

                <h2>Papel de Envoltura</h2>
                <div className="customCards">
                    {wrappingPaper.map(paper => (
                        <div key={paper.id} className={`customCards__customCard ${isSelectable('Papel') ? '' : 'disabled'}`}>
                            <img src={paper.imageUrl} alt={paper.name} />
                            <div className='data-custom-product'>
                                <h3>{paper.name}</h3>
                                <p>₡{paper.price}</p>
                            </div>
                            <button className='add-Button' onClick={() => handleSelectItem(paper)} disabled={!isSelectable('Papel')}>Elegir</button>
                        </div>
                    ))}
                </div>

                <h2>Follaje</h2>
                <div className="customCards">
                    {foliage.map(follaje => (
                        <div key={follaje.id} className={`customCards__customCard ${isSelectable('Follaje') ? '' : 'disabled'}`}>
                            <img src={follaje.imageUrl} alt={follaje.name} />
                            <div className='data-custom-product'>
                                <h3>{follaje.name}</h3>
                                <p>₡{follaje.price}</p>
                            </div>
                            <button className='add-Button' onClick={() => handleSelectItem(follaje)} disabled={!isSelectable('Follaje')}>Elegir</button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="selected-items">
                <h3>Elementos seleccionados</h3>
                {selectedItems.map((item, index) => (
                    <div className="item-card" key={index}>
                        <button className="item-card__remove" onClick={() => handleRemoveItem(item, index)}>x</button>
                        <img className='item-card__img' src={item.imageUrl} alt={item.name} />
                        <div className="item-card__info">
                            <p>{item.name} - ₡{item.price}</p>
                            <h6>{item.type}</h6>
                        </div>
                    </div>
                ))}
                <input
                    type="text"
                    placeholder="Nombre del producto personalizado"
                    value={customProductName}
                    onChange={(e) => setCustomProductName(e.target.value)}
                    className="custom-input"
                />
                <h3>Total: ₡{total}</h3>
                <button onClick={() => createCustomProduct('SHOPPINGCART')} disabled={!customProductName}>Agregar al carrito</button>
                <button onClick={() => createCustomProduct('WISHLIST')} disabled={!customProductName}>Agregar a lista de deseos</button>
                <div className={`notificationMessage ${showNotification ? 'show' : ''}`}>
                    {notificationMessage}
                </div>
            </div>
            <div className='containerMain'>
                <Modal isOpen={showModal} onClose={() => setShowModal(false)} message={modalMessage} />
            </div>
        </div>
    );
}

export default CustomProduct;
