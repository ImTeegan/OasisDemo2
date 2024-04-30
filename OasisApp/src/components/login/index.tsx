import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { userState } from '../../atoms/sessionState';
import { fetchUsers } from '../../services/fetchProducts';
import './styles.scss';

const LoginComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const setUser = useSetRecoilState(userState);
    const navigate = useNavigate();
    const [error, setError] = useState('');

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

        const users = await fetchUsers();

        const userExists = users.find(user => user.email === username && user.password === password);
        if (userExists) {
            setUser({ isLoggedIn: true, name: userExists.name });
            navigate('/');
        } else {
            setError('Credenciales incorrectas');
        }
    };

    return (
        <div className="login-background">
            <div className="login-container">
                <h1>Iniciar Sesión</h1>
                <form onSubmit={handleLogin}>
                    <label>
                        Correo Electrónico:
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
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                </form>
            </div>
        </div>
    );
};

export default LoginComponent;
