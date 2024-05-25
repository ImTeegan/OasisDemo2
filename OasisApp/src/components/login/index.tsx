import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import axios from 'axios';
import { userState } from '../../atoms/sessionState';
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

        /*if (password.length < 8) {
            alert('La contraseña debe tener al menos 8 caracteres.');
            return;
        }
*/
        try {
            const response = await axios.post('http://localhost:8080/auth/login', {
                email: username,
                password: password,
            });

            const { token, expiresIn } = response.data;


            localStorage.setItem('token', token);


            const userResponse = await axios.get('http://localhost:8080/users/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const userData = userResponse.data;


            setUser({ isLoggedIn: true, name: userData.name, role: userData.role });


            navigate('/');
        } catch (error) {
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
                    <p className='linktolos'> Aún no tienes una cuenta? <Link to="/signup">Crear cuenta</Link></p>
                </form>
            </div>
        </div>
    );
};

export default LoginComponent;
