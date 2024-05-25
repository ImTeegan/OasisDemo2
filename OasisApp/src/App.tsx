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

      </Routes>
    </>
  )
}

export default App
