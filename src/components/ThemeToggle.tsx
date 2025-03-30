import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="btn p-0"
      style={{ color: 'var(--text-primary)' }}
    >
      <i className="material-icons">{theme === 'light' ? 'dark_mode' : 'light_mode'}</i>
    </button>
  );
};

export default ThemeToggle;
