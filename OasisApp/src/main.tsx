import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RecoilRoot } from 'recoil';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/navbar/index.tsx';
//import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './components/footer/index.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <Router>
      <Navbar />
      <App />
      <Footer />
      </Router>
    </RecoilRoot>
  </React.StrictMode>,
)
