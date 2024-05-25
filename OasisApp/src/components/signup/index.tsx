import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.scss';

const SignupComponent = () => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (event) => {
        event.preventDefault();

        if (!name || !lastName || !email || !password) {
            setError('Todos los campos deben ser llenados.');
            return;
        }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            setError('Por favor, ingrese un correo electrónico válido.');
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            setError('La contraseña debe tener al menos 8 caracteres, incluyendo una minúscula, una mayúscula y un número.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/auth/signup', {
                name: name,
                lastName: lastName,
                email: email,
                password: password,
            });

            if (response.status === 200) {
                navigate('/login');
            } else {
                setError('Error al crear la cuenta. Inténtalo de nuevo.');
            }
        } catch (error) {
            setError('Error al crear la cuenta. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="login-background">
            <div className="login-container">
                <h1>Registrarse</h1>
                <form onSubmit={handleSignup}>
                    <label>
                        Nombre:
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Apellido:
                        <input
                            type="text"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Correo Electrónico:
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
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
                    <button type="submit">Registrarse</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
                <p className='linktolos'>Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link></p>
            </div>
        </div>
    );
};

export default SignupComponent;
