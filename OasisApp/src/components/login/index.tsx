import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate en lugar de useHistory
import { useSetRecoilState } from 'recoil';
import { isLoggedInState } from '../../atoms/sessionState'; // Asegúrate de que la ruta al atom es correcta
import './styles.scss';


const LoginComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const setIsLoggedIn = useSetRecoilState(isLoggedInState);
    const navigate = useNavigate(); // Cambia useHistory por useNavigate

    const handleLogin = (event) => {
        event.preventDefault();
        if (username && password) {
            setIsLoggedIn(true);  // Actualiza el estado global a logueado
            navigate('/');  // Uso de navigate en lugar de history.push
        } else {
            alert('Por favor, ingrese todos los campos.');
        }
    };

    return (
        <div className="login-container">
            <h1>Iniciar Sesión</h1>
            <form onSubmit={handleLogin}>
                <label>
                    Nombre de usuario:
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Contraseña:
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default LoginComponent;
