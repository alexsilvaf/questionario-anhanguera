import { useState, useEffect } from 'react';
import courseService from '../services/courseService';
import Layout from '../components/Layout';

const Home = () => {
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

  return (
    <div>
      <Layout>
        <p>Bem-vindo ao sistema!</p>
        <div>
          <h2>Lista de Cursos</h2>
          <ul>
            {courses.map((course: any) => (
              <li key={course.id}>{course.name}</li>
            ))}
          </ul>
        </div>
      </Layout>
    </div>
  );
};

export default Home;
