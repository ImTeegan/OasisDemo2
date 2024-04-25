import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RecoilRoot } from 'recoil';
import Navbar from './components/navbar/index.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './components/footer/index.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <Navbar />
      <App />
      <Footer />
    </RecoilRoot>
  </React.StrictMode>,
)
