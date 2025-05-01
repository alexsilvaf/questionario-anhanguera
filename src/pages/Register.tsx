import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ui-components/ThemeToggle';
import { RegisterModel } from '../models/RegisterModel';
import authenticationService from '../services/authenticationService';
import './css/Login.css';
import { InviteModel } from '../models/InviteModel';

const Register = () => {
    const navigate = useNavigate();
    const { search } = useLocation();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [groupName, setGroupName] = useState('');
    const [courseClassName, setCourseClassName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(search);
        const token = params.get('token');
        if (!token) {
            setError('Token de convite não fornecido');
            return;
        }

        authenticationService
            .getInviteByToken(token)
            .then((inv: InviteModel) => {
                setEmail(inv.email);
                setGroupName(inv.groupName);
                setCourseClassName(inv.courseClassName);
            })
            .catch(err => {
                setError(err.response?.data?.message || 'Convite inválido');
            });
    }, [search]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password || !confirmPassword) {
            setError('Preencha todos os campos obrigatórios.');
            return;
        }

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        const payload: RegisterModel = {
            firstName,
            lastName,
            email,
            password,
            token: new URLSearchParams(search).get('token') || '',
        };

        try {
            await authenticationService.register(payload);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao registrar.');
        }
    };

    return (
        <div className="container-fluid login-container d-flex align-items-center justify-content-center">
            <div className="login-card p-4 w-100" style={{ maxWidth: '400px' }}>
                <div className="text-center mb-4">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                        <img src="/src/assets/logo_estudante360.svg" alt="Estudante360 Logo" style={{ width: '64px' }} />
                    </div>
                    <p className="subtitle">Criar Conta</p>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control app-input"
                            placeholder="Turma"
                            value={courseClassName}
                            disabled
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control app-input"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control app-input"
                            placeholder="Nome"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control app-input"
                            placeholder="Sobrenome"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control app-input"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control app-input"
                            placeholder="Confirmar Senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control app-input"
                            placeholder="Grupo"
                            value={groupName}
                            disabled
                        />
                    </div>

                    <button type="submit" className="btn sign-in-btn w-100">Registrar</button>
                </form>

                <p className="signup-text text-center mt-3">
                    Já possui uma conta? <a href="/">Entrar</a>
                </p>

                <div className='d-flex justify-content-center mt-4'>
                    <ThemeToggle />
                </div>
            </div>
        </div>
    );
};

export default Register;
