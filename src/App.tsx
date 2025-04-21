// src/App.tsx
import { JSX } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

import Layout from './components/Layout'
import Home from './pages/Home'
import Materias from './pages/Materias'
import ManageGroups from './pages/ManageGroups'
import ManagePermissions from './pages/ManagePermissions'

function PublicRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <div>Carregando...</div>
  return isAuthenticated ? <Navigate to="/" replace /> : children
}

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <div>Carregando...</div>
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Home />} />
          <Route path="materias" element={<Materias />} />

          <Route path="grupos">
            <Route index element={<ManageGroups />} />
            <Route path="new" element={<ManagePermissions />} />
            <Route path="edit/:id" element={<ManagePermissions />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}
