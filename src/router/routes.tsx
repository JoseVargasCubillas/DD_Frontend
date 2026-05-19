import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@templates/MainLayout';
import AuthLayout from '@templates/AuthLayout';
import DashboardLayout from '@templates/DashboardLayout';
import AdminLayout from '@templates/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

import Home from '@pages/Home';
import About from '@pages/About';
import CourseList from '@pages/Courses/CourseList';
import CourseDetail from '@pages/Courses/CourseDetail';
import CourseLesson from '@pages/Courses/CourseLesson';
import Events from '@pages/Events';
import EventDetail from '@pages/Events/EventDetail';
import BlogList from '@pages/Blog/BlogList';
import BlogPost from '@pages/Blog/BlogPost';
import Academy from '@pages/Academy';
import Resources from '@pages/Resources';
import Contact from '@pages/Contact';
import Login from '@pages/Auth/Login';
import Register from '@pages/Auth/Register';
import UserDashboard from '@pages/Dashboard/UserDashboard';
import MyCourses from '@pages/Dashboard/MyCourses';
import Profile from '@pages/Dashboard/Profile';
import Checkout from '@pages/Checkout';
import AdminDashboard from '@pages/Admin/AdminDashboard';
import ManageCourses from '@pages/Admin/ManageCourses';
import ManageUsers from '@pages/Admin/ManageUsers';
import ManageEvents from '@pages/Admin/ManageEvents';
import ManageBlog from '@pages/Admin/ManageBlog';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/acerca', element: <About /> },
      { path: '/cursos', element: <CourseList /> },
      { path: '/cursos/:slug', element: <CourseDetail /> },
      { path: '/eventos', element: <Events /> },
      { path: '/eventos/:slug', element: <EventDetail /> },
      { path: '/blog', element: <BlogList /> },
      { path: '/blog/:slug', element: <BlogPost /> },
      { path: '/academia', element: <Academy /> },
      { path: '/recursos', element: <Resources /> },
      { path: '/contacto', element: <Contact /> },
      { path: '/checkout', element: <ProtectedRoute><Checkout /></ProtectedRoute> },
      {
        path: '/cursos/:slug/leccion/:lessonId',
        element: <ProtectedRoute><CourseLesson /></ProtectedRoute>,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/iniciar-sesion', element: <Login /> },
      { path: '/registro', element: <Register /> },
    ],
  },
  {
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      { path: '/mi-cuenta', element: <UserDashboard /> },
      { path: '/mi-cuenta/cursos', element: <MyCourses /> },
      { path: '/mi-cuenta/perfil', element: <Profile /> },
    ],
  },
  {
    element: <AdminRoute><AdminLayout /></AdminRoute>,
    children: [
      { path: '/admin', element: <AdminDashboard /> },
      { path: '/admin/cursos', element: <ManageCourses /> },
      { path: '/admin/usuarios', element: <ManageUsers /> },
      { path: '/admin/eventos', element: <ManageEvents /> },
      { path: '/admin/blog', element: <ManageBlog /> },
    ],
  },
]);
