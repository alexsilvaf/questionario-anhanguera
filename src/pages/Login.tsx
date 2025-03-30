import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './css/Login.css'; // Certifique-se de ter esse arquivo com os estilos personalizados
import ThemeToggle from '../components/ThemeToggle';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ email, password });
            navigate('/');
        } catch (err) {
            setError('Credenciais inválidas ou erro no login.');
        }
    };

    return (
        <div className="container-fluid login-container d-flex align-items-center justify-content-center">
            <div className="login-card p-4 w-100" style={{ maxWidth: '400px' }}>
                <div className="text-center mb-4">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                        <img src="/src/assets/logo.png" alt="Anhanguera Logo" className="mb-2" style={{ width: '64px' }} />
                        <h1 className="mb-0 logo-text">Anhanguera</h1>
                    </div>
                    <p className="subtitle">Simulador de Questões</p>
                </div>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control app-input"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3 position-relative">
                        <div className="app-password-input-wrapper">
                            <input
                                type="password"
                                className="app-password-input"
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <a href="#" className="forgot-password-inside">Esqueceu a senha?</a>
                        </div>
                    </div>


                    <button type="submit" className="btn sign-in-btn w-100">Entrar</button>
                </form>

                <p className="signup-text text-center mt-3">
                    Não possui uma conta? <Link to="/register">Registrar-se</Link>
                    <span className='d-flex justify-content-center mt-4'>
                        <ThemeToggle />
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
