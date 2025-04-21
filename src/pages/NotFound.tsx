// src/pages/NotFound.tsx
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NotFound: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <Box p={4} textAlign="center">
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  const handleClick = () => {
    if (isAuthenticated) {
      navigate('/')
    } else {
      navigate('/login')
    }
  }

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      px={2}
      textAlign="center"
    >
      <Typography variant="h3" gutterBottom>
        Ops!
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Não conseguimos encontrar esta página.
      </Typography>
      <Button
        variant="contained"
        size="large"
        className="text-white"
        onClick={handleClick}
      >
        {isAuthenticated ? 'Ir para a página inicial' : 'Voltar ao login'}
      </Button>
    </Box>
  )
}

export default NotFound
