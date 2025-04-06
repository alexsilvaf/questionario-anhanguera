import { NavLink } from 'react-router-dom';

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

export default function Nav() {
  return (
    <>
      <div className='d-flex flex-column sidebar'>
        <div className="d-flex justify-content-center align-items-center">
          <img src="/src/assets/logo.png" alt="Logo" width={'70px'} />
          <div className="logo-text header__title fw-bold fs-4">Anhanguera</div>
        </div>

        <nav>
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
        </nav>
      </div>
    </>
  );
}
