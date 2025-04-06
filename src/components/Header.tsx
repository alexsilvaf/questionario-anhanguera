import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Header() {

    const { logout } = useAuth();
    
    const handleLogout = async () => {
      await logout();
    };

    return (
        <header className="header justify-content-end">
            <div className="me-3">
                <ThemeToggle/>
            </div>
            <button
            onClick={handleLogout}
            className="btn p-0"
            style={{
                color: 'var(--text-primary)',
                outline: 'none',
                boxShadow: 'none',
                border: 'none',
            }}
            >
                <i className="material-icons">logout</i>
            </button>
        </header>
    );
}
