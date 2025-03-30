import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Login.css';
import ThemeToggle from '../components/ThemeToggle';
import AppDropdown from '../components/AppDropdown';
import { RegisterModel } from '../models/RegisterModel';
import autenticationService from '../services/autenticationService';
import courseService from '../services/courseService'; // ⬅️ novo
import CpfInput from '../components/CpfInput';
import { CourseModel } from '../models/CourseModel';

const Register = () => {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [cursoId, setCursoId] = useState('');
    const [turmaId, setTurmaId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const [cursosData, setCursosData] = useState<CourseModel[]>([]); // ⬅️ cursos com turmas

    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const response = await courseService.getCourses(); // API call
                setCursosData(response.data);
            } catch (error) {
                console.error('Erro ao buscar cursos', error);
            }
        };

        fetchCursos();
    }, []);

    const cursoOptions = cursosData.map(c => ({
        label: c.name,
        value: String(c.id)
    }));

    const turmaOptions = cursosData
        .find(c => String(c.id) === cursoId)
        ?.courseClassList.map(t => ({
            label: t.name,
            value: String(t.id)
        })) || [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !cursoId || !turmaId || !password || !confirmPassword) {
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
            cpf,
            email,
            idCourseClass: parseInt(turmaId),
            password
        };

        try {
            await autenticationService.register(payload);
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
                        <img src="/src/assets/logo.png" alt="Anhanguera Logo" className="mb-2" style={{ width: '64px' }} />
                        <h1 className="mb-0 logo-text">Anhanguera</h1>
                    </div>
                    <p className="subtitle">Criar Conta</p>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
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
                        <CpfInput value={cpf} onChange={setCpf} />
                    </div>

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

                    <div className="mb-3">
                        <AppDropdown
                            placeholder="Curso"
                            value={cursoId}
                            onChange={(val) => {
                                setCursoId(val);
                                setTurmaId('');
                            }}
                            options={cursoOptions}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <AppDropdown
                            placeholder="Turma"
                            value={turmaId}
                            onChange={setTurmaId}
                            options={turmaOptions}
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
