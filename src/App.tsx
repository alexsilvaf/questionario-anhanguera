import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import { useAuth } from './context/AuthContext';
import { JSX } from 'react';
import Register from './pages/Register';
import Materias from './pages/Materias';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ManageGroups from './pages/ManageGroups';
import ManagePermissions from './pages/ManagePermissions';

function PublicRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return isAuthenticated ? <Navigate to="/" /> : children;
}

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/materias" element={<PrivateRoute><Materias /></PrivateRoute>} />
        <Route path="/grupos" element={<PrivateRoute><ManageGroups /></PrivateRoute>} />
        <Route path="/grupos/edit/:id" element={<PrivateRoute><ManagePermissions /></PrivateRoute>} />
        <Route path="/grupos/new" element={<PrivateRoute><ManagePermissions /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;