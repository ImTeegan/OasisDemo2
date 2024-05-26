import React, { useState, useEffect, useCallback } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './views/home-page';
import ProductList from './views/product-list';
import ProductDetails from './views/product-details';
import Checkout from './views/checkout';
import Create from './views/create';
import LogIn from './views/LogIn';
import Cart from './views/cart';
import Signup from './views/Signup';
import AdminDashboard from './views/admin-dashboard';
import ProductDashboard from './components/product-dashboard';
import OrderDashboard from './components/order-dashboard';
import CreateProduct from './components/create-product-from';
import EditProduct from './views/product-to-edit';
import OrderDetails from './components/order-details';



function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product-list" element={<ProductList />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/create" element={<Create />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />
        <Route path='/admin-dashboard' element={<AdminDashboard />} />
        <Route path="/admin-dashboard/product" element={<ProductDashboard />} />
        <Route path="/admin-dashboard/order" element={<OrderDashboard />} />
        <Route path='/create-product' element={<CreateProduct />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/order-details/:id" element={<OrderDetails />} />
      </Routes>
    </>
  )
}

export default App
