import http from './http';

const getCourses = () => {
    return http.get('/course/list');
};

const courseService = {
    getCourses,
};

export default courseService;
