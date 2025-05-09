import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

interface NavItem {
  to: string;
  icon: string;
  label: string;
  requiredAuth?: string;    // <-- autoridade necessária (opcional)
}

const navItems: NavItem[] = [
  {
    to: "/", 
    icon: "dashboard", 
    label: "Dashboard"
  },
  {
    to: "/materias",
    icon: "menu_book",
    label: "Matérias"
  },
];

const navItemsBottom: NavItem[] = [
  {
    to: "/usuarios",
    icon: "group",
    label: "Gerenciar Usuários",
    requiredAuth: "Estudante360Permissions.User.findByClassName",
  },
];

export default function Nav() {

  const { logout, loggedUser } = useAuth();
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      navigate('/login', { replace: true })
    }
  }

  const topItems = navItems.filter(item => {
    if (!item.requiredAuth) return true;
    return loggedUser?.authorities?.some(a => a.authority.includes(''+item.requiredAuth));
  });
  
  const bottomItems = navItemsBottom.filter(item => {
    if (!item.requiredAuth) return true;
    return loggedUser?.authorities?.some(a => a.authority.includes(''+item.requiredAuth));
  });
  
  return (
    <>
      <div className='d-flex flex-column sidebar'>
        <div className="d-flex justify-content-between align-items-center px-3" style={{ height: '75px' }}>
          <img src="/src/assets/logo_estudante360.svg" alt="Estudante360 Logo" style={{ width: '45px' }} />
          <div className="">
            <span className="logo-text header__title fw-bold">Estudante 360</span>
          </div>
        </div>

        <nav className="d-flex flex-column h-100">
          <ul className="ps-0">
            {topItems.map(({ to, icon, label }) => (
              <li key={to} className="d-flex align-items-center mb-1">
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    "d-flex align-items-center text-decoration-none w-100" + (isActive ? " active" : "")
                  }
                >
                  <span className="material-icons primary-color me-3">{icon}</span>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
          <ul className="ps-0 mt-auto">
            {bottomItems.map(({ to, icon, label }) => (
              <li key={to} className="d-flex align-items-center mb-1">
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    "d-flex align-items-center text-decoration-none w-100" + (isActive ? " active" : "")
                  }
                >
                  <span className="material-icons primary-color me-3">{icon}</span>
                  {label}
                </NavLink>
              </li>
            ))}
            <li>
              <Button className="w-100 justify-content-start" onClick={handleLogout}>
                <LogoutIcon color="primary" className="me-3" />
                Sair
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
