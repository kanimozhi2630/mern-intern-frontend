import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  logout: () => API.post('/auth/logout'),
  getProfile: () => API.get('/auth/profile'),
  createStudent: (data) => API.post('/auth/create-student', data)
};

export const progressAPI = {
  getMyProgress: () => API.get('/progress/my-progress'),
  getStudentProgress: (studentId) => API.get(`/progress/student/${studentId}`),
  updateStudentProgress: (studentId, data) => API.put(`/progress/student/${studentId}`, data),
  getStudents: () => API.get('/progress/students'),
  getDepartments: () => API.get('/progress/departments')
};

export default API;
