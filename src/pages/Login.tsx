import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail } from 'lucide-react';
import './css/Login.css';
import ThemeToggle from '../components/ThemeToggle';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('admin@mail.com');
    const [password, setPassword] = useState('administrador');
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
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
                        <img
                            src="/src/assets/logo.png"
                            alt="Estudante360 Logo"
                            className="mb-2"
                            style={{ width: '64px' }}
                        />
                        <h1 className="mb-0 logo-text">Anhanguera</h1>
                    </div>
                    <p className="subtitle">Estudante360</p>
                </div>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit} className="login-form">
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <div className="app-input-wrapper">
                            <Mail className="input-icon" size={16} />
                            <input
                                id="email"
                                type="email"
                                className="app-email-input"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Senha
                        </label>
                        <div className="app-password-input-wrapper">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                className="app-password-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        <div className="text-end mt-1">
                            <Link to="/forgot-password" className="forgot-password-link pe-1">
                                Esqueceu a senha?
                            </Link>
                        </div>
                    </div>

                    <button type="submit" className="btn sign-in-btn w-100">
                        Entrar
                    </button>
                </form>

                <p className="signup-text text-center mt-3">
                    Não possui convite? Solicite ao seu coordenador.
                </p>
                <div className="d-flex justify-content-center mt-4">
                    <ThemeToggle />
                </div>
            </div>
        </div>
    );
};

export default Login;
