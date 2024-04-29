import React, { useState } from 'react';
//import styles from './Navbar.module.scss';
//import logo from '../../assets/logo.svg';
//import cartIcon from '../../assets/cart-icon.svg';
import logo from '../../../public/images/Logoalternativo.png';
import shoppingBag from '../../../public/icons/shoppingBag.png';
import facebook from '../../../public/icons/facebook.png';
import instagram from '../../../public/icons/instagram.png';
import './styles.scss'


const Footer: React.FC = () => {

    return (
        <footer className="footer">
            <section className="social-media">
                <div className="social-media__left">
                    <span>Contactanos por nuestras redes sociales:</span>
                </div>

                <div className="social-media__right">
                    <a href="" aria-label="pagina de facebook">
                        <img src={facebook} alt="facebook link" />
                    </a>
                    <a href="" aria-label="pagina de instagram">
                        <img src={instagram} alt="instagram link" />
                    </a>
                </div>
            </section>

            <section className="info-footer">
                        <div className="info-footer__disclaimer">
                            <h6>
                                Oasis Floristeria y Eventos
                            </h6>
                            <p>
                                La información presentada en este sitio web tiene fines meramente informativos y
                                puede cambiar sin previo aviso. Nos esforzamos por proporcionar descripciones
                                precisas y actualizadas de nuestros productos, sin embargo, las imágenes y los
                                detalles pueden variar debido a la disponibilidad y la temporada.
                            </p>
                        </div>

                        <div className="info-footer__contact">
                            <h6 className="">Contacto</h6>
                            <p><i className=""></i> Ciudad Colon, San Jose</p>
                            <p>
                                <i className=""></i>
                                oasis@oasis.com
                            </p>
                            <p><i className=""></i> 8861 1687</p>
                        </div>
                  
            </section>

            <div className="copyright" >
                © 2024 Copyright: 
                
                <a className="" href="https://mdbootstrap.com/"> oasisfloristeriayeventos.com</a>
            </div>
        </footer>


    );
};

export default Footer;
