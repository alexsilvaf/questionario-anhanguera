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
import PermissionRoute from './components/PermissionRoute'
import ManageUsers from './pages/ManageUsers'
import ConfirmEmail from './pages/ConfirmEmail'

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

type SecuredConfig = {
  path?: string
  index?: boolean
  required: string
  element: JSX.Element
}

const makeSecuredRoute = ({
  path,
  index = false,
  required,
  element,
}: SecuredConfig) =>
  index ? (
    <Route
      index
      key="index"
      element={<PermissionRoute required={required}>{element}</PermissionRoute>}
    />
  ) : (
    <Route
      path={path}
      key={path}
      element={<PermissionRoute required={required}>{element}</PermissionRoute>}
    />
  )

export default function App() {
  const securedRoutes: SecuredConfig[] = [
    { index: true, required: '', element: <Home /> },
    { path: 'materias', required: '', element: <Materias /> },
    { path: 'usuarios', required: 'Estudante360Permissions.User.findByClassName', element: <ManageUsers /> },
    { path: 'grupos', required: 'Estudante360Permissions.Group', element: <ManageGroups /> },
  ]

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/confirm" element={<PublicRoute><ConfirmEmail /></PublicRoute>} />


        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          {securedRoutes.map(makeSecuredRoute)}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}
