import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import ThemeToggle from '../components/ui-components/ThemeToggle';
import authenticationService from '../services/authenticationService';
import './css/Login.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
  
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);
        try {
            const response = await authenticationService.sendPasswordResetEmail(email);
            const serverMessage = response || 'Link de redefinição enviado com sucesso.';
            setSuccess(serverMessage);
        } catch (err: any) {
            setError(
                err?.message ||
                'Ocorreu um erro ao enviar o e-mail de redefinição de senha. Tente novamente mais tarde.'
            )
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="container-fluid login-container d-flex align-items-center justify-content-center">
      <div className="login-card p-4 w-100" style={{ maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <div className="d-flex align-items-center justify-content-center mb-2">
          <img src="/src/assets/logo_estudante360.svg" alt="Estudante360 Logo" style={{ width: '64px' }} />
          </div>
          <p className="subtitle">Recuperar Senha</p>
          <p className="text-secondary mb-3">
            Informe seu e‑mail para receber o link de redefinição
          </p>
        </div>

        {error && (
        <div className="alert alert-danger" role="alert">
            {error}
        </div>
        )}
        {success && (
        <div className="alert alert-success" role="alert">
            {success}
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
                disabled={loading}
              />
            </div>
          </div>

          <button 
          type="submit" 
          className="btn sign-in-btn w-100"
          disabled={loading}>
            Enviar link
          </button>
        </form>

        <p className="signup-text text-center mt-3">
          <Link to="/login">Voltar ao login</Link>
        </p>

        <div className="d-flex justify-content-center mt-4">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

