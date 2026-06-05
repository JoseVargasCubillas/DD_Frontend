import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@templates/MainLayout';
import AuthLayout from '@templates/AuthLayout';
import DashboardLayout from '@templates/DashboardLayout';
import AdminLayout from '@templates/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

const Home           = lazy(() => import('@pages/Home'));
const About          = lazy(() => import('@pages/About'));
const CourseList     = lazy(() => import('@pages/Courses/CourseList'));
const CourseDetail   = lazy(() => import('@pages/Courses/CourseDetail'));
const CourseLesson   = lazy(() => import('@pages/Courses/CourseLesson'));
const Events         = lazy(() => import('@pages/Events'));
const EventDetail    = lazy(() => import('@pages/Events/EventDetail'));
const BlogList       = lazy(() => import('@pages/Blog/BlogList'));
const BlogPost       = lazy(() => import('@pages/Blog/BlogPost'));
const Academy        = lazy(() => import('@pages/Academy'));
const Resources      = lazy(() => import('@pages/Resources'));
const Contact        = lazy(() => import('@pages/Contact'));
const Login          = lazy(() => import('@pages/Auth/Login'));
const Register       = lazy(() => import('@pages/Auth/Register'));
const UserDashboard  = lazy(() => import('@pages/Dashboard/UserDashboard'));
const MyCourses      = lazy(() => import('@pages/Dashboard/MyCourses'));
const Profile        = lazy(() => import('@pages/Dashboard/Profile'));
const Checkout       = lazy(() => import('@pages/Checkout'));
const AdminDashboard = lazy(() => import('@pages/Admin/AdminDashboard'));
const ManageCourses  = lazy(() => import('@pages/Admin/ManageCourses'));
const ManageUsers    = lazy(() => import('@pages/Admin/ManageUsers'));
const ManageEvents   = lazy(() => import('@pages/Admin/ManageEvents'));
const ManageBlog     = lazy(() => import('@pages/Admin/ManageBlog'));

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
