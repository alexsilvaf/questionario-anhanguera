// src/pages/ConfirmEmail.tsx
import {
    Alert,
    Box,
    Button,
    CircularProgress
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import authenticationService from '../services/authenticationService';

const ConfirmEmail: React.FC = () => {
  const { search } = useLocation();
  const navigate    = useNavigate();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>('');
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const token  = params.get('token');
    if (!token) {
      setError('Token não fornecido.');
      setLoading(false);
      return;
    }

    authenticationService
      .confirmEmail(token)
      .then(msg => setMessage(msg))
      .catch(err => {
        setError(err.response?.data?.message || 'Falha ao confirmar e-mail.');
      })
      .finally(() => setLoading(false));
  }, [search]);

  if (loading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      className="container-fluid login-container d-flex align-items-center justify-content-center"
      height="100vh"
    >
      <Box
        className="login-card p-4 w-100"
        sx={{ maxWidth: 400, textAlign: 'center' }}
      >
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
        >
          {error ? 'Voltar' : 'Fazer Login'}
        </Button>
      </Box>
    </Box>
  );
};

export default ConfirmEmail;
