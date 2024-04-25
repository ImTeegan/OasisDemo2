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
        <footer className="text-center text-lg-start bg-body-tertiary text-muted">
            <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
                <div className="me-5 d-none d-lg-block upper-footer-left">
                    <span>Contactanos por nuestras redes sociales:</span>
                </div>

                <div className="upper-footer-right">
                    <a href="" className="me-4 text-reset" aria-label="pagina de facebook">
                        <img className='socialMediaIcon' src={facebook} alt="facebook link" />
                    </a>
                    <a href="" className="me-4 text-reset" aria-label="Repagina de instagram">
                        <img className='socialMediaIcon' src={instagram} alt="instagram link" />
                    </a>
                </div>
            </section>

            <section>
                <div className="container text-center text-md-start mt-5">
                    <div className="row mt-3">
                        <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4 titulo-footer">
                                Oasis Floristeria y Eventos
                            </h6>
                            <p className="parag">
                                La información presentada en este sitio web tiene fines meramente informativos y
                                puede cambiar sin previo aviso. Nos esforzamos por proporcionar descripciones
                                precisas y actualizadas de nuestros productos, sin embargo, las imágenes y los
                                detalles pueden variar debido a la disponibilidad y la temporada.
                            </p>
                        </div>

                        <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4 contact-footer">
                            <h6 className="text-uppercase fw-bold mb-4">Contacto</h6>
                            <p><i className="material-icons me-3">add_location</i> Ciudad Colon, San Jose</p>
                            <p>
                                <i className="material-icons me-3">mail_outline</i>
                                oasis@oasis.com
                            </p>
                            <p><i className="material-icons me-3">phone</i> 8861 1687</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="text-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                © 2024 Copyright:
                <a className="text-reset fw-bold" href="https://mdbootstrap.com/">oasisfloristeriayeventos.com</a>
            </div>
        </footer>

    );
};

export default Footer;
