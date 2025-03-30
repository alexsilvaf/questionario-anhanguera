import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import courseService from '../services/courseService';
import ThemeToggle from '../components/ThemeToggle';

const Home = () => {
  const { logout } = useAuth();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
      courseService.getCourses()
          .then((res) => {
              setCourses(res.data);
          })
          .catch((err) => {
              console.error('Erro ao buscar cursos', err);
          });
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div>
      <header className='w-100 d-flex justify-content-end'>
        <ThemeToggle />
      </header>
      
      <p>Bem-vindo ao sistema!</p>
        <div>
            <h2>Lista de Cursos</h2>
            <ul>
                {courses.map((course: any) => (
                    <li key={course.id}>{course.name}</li>
                ))}
            </ul>
        </div>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
};

export default Home;
