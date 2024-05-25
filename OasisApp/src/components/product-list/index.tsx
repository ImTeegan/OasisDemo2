import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Product } from '../../types/types';
import axios from 'axios';
import './styles.scss';
import { useRecoilState } from 'recoil';
import { selectedProductsState } from '../../atoms/cartAtom';
import { userState } from '../../atoms/sessionState';

const ProductListComponent = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [productsPerPage] = useState<number>(12);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState<string[]>([]);
    const [sortPrice, setSortPrice] = useState('');
    const [totalPages, setTotalPages] = useState<number>(1);
    const [selectedProducts, setSelectedProducts] = useRecoilState(selectedProductsState);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [user, setUser] = useRecoilState(userState);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/products/getAllTypeProducts', {
                    params: {
                        page: currentPage - 1,
                        size: productsPerPage,
                        search: search || undefined,
                        categories: filterCategory.length ? filterCategory.join(',') : undefined,
                        sort: sortPrice || undefined
                    }
                });
                setProducts(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.log('Failed to fetch products', error);
            }
        };

        loadProducts();

        const query = new URLSearchParams();
        if (search) query.set('search', search);
        if (filterCategory.length) query.set('categories', filterCategory.join(','));
        if (sortPrice) query.set('sort', sortPrice);
        query.set('page', String(currentPage));
        query.set('size', String(productsPerPage));

        navigate(`${location.pathname}?${query.toString()}`, { replace: true });
    }, [currentPage, search, filterCategory, sortPrice]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        setCurrentPage(1);
    };

    const handleCategoryChange = (category: string, isChecked: boolean) => {
        if (isChecked) {
            setFilterCategory([...filterCategory, category]);
        } else {
            setFilterCategory(filterCategory.filter(cat => cat !== category));
        }
        setCurrentPage(1);
    };

    const handleSortPrice = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortPrice(event.target.value);
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const clearFilters = () => {
        setSearch('');
        setFilterCategory([]);
        setSortPrice('');
        setCurrentPage(1);
    };

    const addProductToCart = async (productToAdd: Product) => {
        if (!user.isLoggedIn) {
            navigate('/login');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await axios.post('http://localhost:8080/shoppingcart/addProduct', {
                productId: productToAdd.id,
                quantity: 1
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setSelectedProducts(prevProducts => {
                const existingProductIndex = prevProducts.findIndex(p => p.id === productToAdd.id);
                if (existingProductIndex !== -1) {
                    const newProducts = [...prevProducts];
                    newProducts[existingProductIndex] = {
                        ...newProducts[existingProductIndex],
                        quantity: newProducts[existingProductIndex].quantity + 1
                    };
                    return newProducts;
                } else {
                    return [...prevProducts, { ...productToAdd, quantity: 1 }];
                }
            });

            setNotificationMessage("Producto agregado al carrito");
            setShowNotification(true);

            setTimeout(() => {
                setShowNotification(false);
            }, 5000);
        } catch (error) {
            console.error('Failed to add product to cart', error);
        }
    };

    return (
        <div>
            <div className='product-list-container'>
                <div className="filters-container">
                    <input type="text" placeholder="Buscar productos" onChange={handleSearch} value={search} />
                    <h3>Categorías</h3>
                    {['Arreglo', 'Ramo', 'Plantas', 'Oficina'].map((category) => (
                        <label key={category}>
                            <input
                                type="checkbox"
                                checked={filterCategory.includes(category)}
                                onChange={(e) => handleCategoryChange(category, e.target.checked)}
                            />
                            {category}
                        </label>
                    ))}
                    <select aria-label='orden' onChange={handleSortPrice} value={sortPrice}>
                        <option value="">Seleccionar orden</option>
                        <option value="lowToHigh">Precio: Bajo a Alto</option>
                        <option value="highToLow">Precio: Alto a Bajo</option>
                    </select>
                    <button onClick={clearFilters}>Limpiar filtros</button>
                </div>

                <div className='cards'>
                    {products.map(product => (
                        <div className='cards__card' key={product.id}>
                            <Link to={`/product-details/${product.id}`} style={{ textDecoration: 'none' }}>
                                <img src={product.imageUrl} alt="" />
                                <div className='data-product'>
                                    <h2>{product.name}</h2>
                                    <p>₡{product.price}</p>
                                </div>
                                <div className='cat-dat'>{product.category}</div>
                            </Link>
                            <button className='addButton' onClick={() => addProductToCart(product)}>Agregar al carrito</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className={`notification ${showNotification ? 'show' : ''}`}>
                {notificationMessage}
            </div>

            <div className='pagination'>
                <button onClick={() => paginate(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                    Anterior
                </button>
                {[...Array(totalPages).keys()].map(number => (
                    <button key={number + 1} onClick={() => paginate(number + 1)} className={currentPage === number + 1 ? 'active' : ''}>
                        {number + 1}
                    </button>
                ))}
                <button onClick={() => paginate(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default ProductListComponent;
