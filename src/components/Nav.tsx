import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  {
    to: "/",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    to: "/materias",
    icon: "menu_book",
    label: "Matérias",
  },
];

const NavItemsBottom = [
  {
    to: "/grupos",
    icon: "groups",
    label: "Grupos e Permissões",
  },
];

export default function Nav() {

  const { logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
  };
  
  return (
    <>
      <div className='d-flex flex-column sidebar'>
        <div className="d-flex justify-content-center align-items-center">
          <img src="/src/assets/logo.png" alt="Logo" width={'70px'} />
          <div className="logo-text header__title fw-bold fs-4">Anhanguera</div>
        </div>

        <nav className="d-flex flex-column h-100">
          <ul className="ps-0">
            {navItems.map(({ to, icon, label }) => (
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
            {NavItemsBottom.map(({ to, icon, label }) => (
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
              <button
              onClick={handleLogout}
              className="btn d-flex align-items-center text-decoration-none w-100"
              >
                  <i className="material-icons primary-color me-3">logout</i>
                  Sair
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
