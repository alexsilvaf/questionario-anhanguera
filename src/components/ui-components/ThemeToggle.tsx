import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="btn p-0"
      style={{
        color: 'var(--text-primary)',
        outline: 'none',
        boxShadow: 'none',
        border: 'none',
      }}
    >
      <i className="material-icons">{theme === 'light' ? 'light_mode' : 'dark_mode'}</i>
    </button>
  );
};

export default ThemeToggle;
