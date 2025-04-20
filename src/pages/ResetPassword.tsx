import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import authenticationService from '../services/autenticationService';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Token inválido ou não fornecido.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      // Supondo que o serviço retorne { message: string }
      const response = await authenticationService.resetPassword(token, password);
      const msg = response || 'Senha redefinida com sucesso.';
      setSuccess(msg);
      // Redireciona após breve delay
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      console.error('Erro ao redefinir senha', err);
      setError(
        err?.response?.data?.message || err?.message || 'Erro interno. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid login-container d-flex align-items-center justify-content-center">
      <div className="login-card p-4 w-100" style={{ maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <img
            src="/src/assets/logo.png"
            alt="Estudante360 Logo"
            style={{ width: '64px' }}
            className="mb-2"
          />
          <h1 className="logo-text mb-1">Redefinir Senha</h1>
          <p className="text-secondary mb-3">
            Escolha uma nova senha para sua conta.
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success" role="alert">
            {success} Redirecionando...
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">
              Nova Senha
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
                disabled={loading}
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
          </div>

          <div className="mb-3 position-relative">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmar Senha
            </label>
            <div className="app-password-input-wrapper">
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                className="app-password-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn sign-in-btn w-100"
            disabled={loading || !token}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" />
            ) : (
              'Redefinir Senha'
            )}
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

export default ResetPassword;
