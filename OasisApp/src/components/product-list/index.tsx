import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/types';
import { fetchProducts } from '../../services/fetchProducts';
import './styles.scss';
import { useRecoilState } from 'recoil';
import { selectedProductsState } from '../../atoms/cartAtom';
import { userState } from '../../atoms/sessionState';
import { useNavigate, useParams } from 'react-router-dom';



const ProductListComponent = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [productsPerPage] = useState<number>(12);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState<string[]>([]);
    const [sortPrice, setSortPrice] = useState('');
    const [selectedProducts, setSelectedProducts] = useRecoilState(selectedProductsState);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [user, setUser] = useRecoilState(userState);  // Estado de sesión
    const navigate = useNavigate();

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const fetchedProducts = await fetchProducts();
                setProducts(fetchedProducts);
            } catch (error) {
                console.log('Failed to fetch products', error);
            }
        };

        loadProducts();
    }, []);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        setCurrentPage(1); // Reset to first page with new search
    };

    const handleCategoryChange = (category: string, isChecked: boolean) => {
        if (isChecked) {
            setFilterCategory([...filterCategory, category]);//here add the category in case it get marked
        } else {
            setFilterCategory(filterCategory.filter(cat => cat !== category));//delete categry from the array. 
        }
        setCurrentPage(1); // Reset to first page with new category filter
    };

    const handleSortPrice = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortPrice(event.target.value);
    };

    const filteredProducts = products
        .filter(product =>
            product.productName.toLowerCase().includes(search.toLowerCase()) ||
            product.category.toLowerCase().includes(search.toLowerCase()))
        .filter(product =>
            filterCategory.length === 0 || filterCategory.includes(product.category))
        .sort((a, b) => {
            if (sortPrice === 'lowToHigh') {
                return a.price - b.price;
            } else if (sortPrice === 'highToLow') {
                return b.price - a.price;
            }
            return 0;
        });

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const clearFilters = () => {
        setSearch('');
        setFilterCategory([]);
        setSortPrice('');
        setCurrentPage(1);  // Restablece también la página a la primera
    };

    const addProductToCart = (productToAdd: Product) => {
        if (!user.isLoggedIn) {
            // Si no está logueado, redirige al login
            navigate('/login');
            return;
        }

        setSelectedProducts(prevProducts => {
            const existingProductIndex = prevProducts.findIndex(p => p.id === productToAdd.id);
            if (existingProductIndex !== -1) {
                // El producto ya existe, incrementar la cantidad
                const newProducts = [...prevProducts];
                newProducts[existingProductIndex] = {
                    ...newProducts[existingProductIndex],
                    quantity: newProducts[existingProductIndex].quantity + 1
                };
                return newProducts;
            } else {
                // Añadir nuevo producto al carrito con cantidad inicial de 1
                return [...prevProducts, { ...productToAdd, quantity: 1 }];
            }
        });

        setNotificationMessage("Producto agregado al carrito");
        setShowNotification(true);

        setTimeout(() => {
            setShowNotification(false);
        }, 5000);
    };

    return (
        <div>
            <div className='product-list-container'>
                <div className="filters-container">
                    <input type="text" placeholder="Buscar productos" onChange={handleSearch} />
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
                    <select onChange={handleSortPrice}>
                        <option value="">Seleccionar orden</option>
                        <option value="lowToHigh">Precio: Bajo a Alto</option>
                        <option value="highToLow">Precio: Alto a Bajo</option>
                    </select>
                    <button onClick={clearFilters}>Limpiar filtros</button>
                </div>

                <div className='cards'>
                    {currentProducts.map(product => (
                        <div className='cards__card' key={product.id}>
                            <Link to={`/product-details/${product.id}`} style={{ textDecoration: 'none' }}>
                                <img src={product.image1} alt="" />
                                <div className='data-product'>
                                    <h2>{product.productName}</h2>
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
