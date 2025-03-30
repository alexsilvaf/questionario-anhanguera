import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div>
      <h2>Home</h2>
      <p>Bem-vindo ao sistema!</p>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
};

export default Home;
