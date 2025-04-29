import { IconButton } from '@mui/material';
import { useTheme } from '../../context/ThemeContext';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <IconButton title="Alterar Modo de Cores" onClick={toggleTheme}>
      {theme === 'light' ?(
        <DarkModeIcon />
      ) : (
        <LightModeIcon />
      )}
</IconButton>
  );
};

export default ThemeToggle;
