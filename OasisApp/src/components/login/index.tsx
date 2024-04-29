import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { userState } from '../../atoms/sessionState';
import { fetchUsers } from '../../services/fetchProducts'; // Importa la función fetchUsers
import './styles.scss';

const LoginComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const setUser = useSetRecoilState(userState);
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(username)) {
            alert('Por favor, ingrese un correo electrónico válido.');
            return;
        }

        if (password.length < 8) {
            alert('La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        // Obtiene los usuarios del archivo JSON
        const users = await fetchUsers();
        const userExists = users.find(user => user.email === username && user.password === password);

        if (userExists) {
            setUser({ isLoggedIn: true, name: userExists.name });   // Actualiza el estado global a logueado
            navigate('/');  // Navega al inicio
        } else {
            alert('Credenciales incorrectas, por favor intente de nuevo.');
        }
    };

    return (
        <div className="login-container">
            <h1>Iniciar Sesión</h1>
            <form onSubmit={handleLogin}>
                <label>
                    Nombre de usuario (Correo Electrónico):
                    <input
                        type="email"
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
