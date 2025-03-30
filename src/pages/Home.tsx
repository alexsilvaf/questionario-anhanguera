import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import courseService from '../services/courseService';

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
      <h2>Home</h2>
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
