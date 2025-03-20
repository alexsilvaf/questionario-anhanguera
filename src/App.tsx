import { useState, useEffect, useRef } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TelaPrincipal from './components/tela-principal/TelaPrincipal';
import Materias from './components/materias/Materias';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top } = headerEl.getBoundingClientRect();
      setCursorPosition({ x: e.clientX - left, y: e.clientY - top });
    };

    const handleMouseEnter = () => {
      setCursorVisible(true);
    };

    const handleMouseLeave = () => {
      setCursorVisible(false);
    };

    headerEl.addEventListener('mousemove', handleMouseMove);
    headerEl.addEventListener('mouseenter', handleMouseEnter);
    headerEl.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      headerEl.removeEventListener('mousemove', handleMouseMove);
      headerEl.removeEventListener('mouseenter', handleMouseEnter);
      headerEl.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <BrowserRouter>
      <header ref={headerRef} className="header d-flex justify-content-between align-items-center px-5 py-2">
        <nav>
          <ul className="d-flex align-items-center my-0">
            <li className="me-4">
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/materias">Matérias</Link>
            </li>
          </ul>
        </nav>

        <button className="theme-toggle" onClick={toggleTheme}>
          <span className="material-icons">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {isDarkMode && cursorVisible && (
          <div
            className="cursor-circle"
            style={{
              left: cursorPosition.x,
              top: cursorPosition.y,
            }}
          ></div>
        )}
      </header>

      <div className="mt-5 mx-5">
        <Routes>
          <Route path="/" element={<TelaPrincipal />} />
          <Route path="/materias" element={<Materias />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
