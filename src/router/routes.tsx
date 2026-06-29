import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@templates/MainLayout";
import AuthLayout from "@templates/AuthLayout";
import DashboardLayout from "@templates/DashboardLayout";
import AdminLayout from "@templates/AdminLayout";
import Events from "@pages/Events";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

const Home = lazy(() => import("@pages/Home"));
const About = lazy(() => import("@pages/About"));
const CourseList = lazy(() => import("@pages/Courses/CourseList"));
const CourseDetail = lazy(() => import("@pages/Courses/CourseDetail"));
const CourseLesson = lazy(() => import("@pages/Courses/CourseLesson"));
const EstrategiaFiscalLanding = lazy(
  () => import("@pages/Events/EstrategiaFiscal"),
);
const EventDetail = lazy(() => import("@pages/Events/EventDetail"));
const BlogList = lazy(() => import("@pages/Blog/BlogList"));
const BlogPost = lazy(() => import("@pages/Blog/BlogPost"));
const Academy = lazy(() => import("@pages/Academy"));
const Resources = lazy(() => import("@pages/Resources"));
const Contact = lazy(() => import("@pages/Contact"));
const Login = lazy(() => import("@pages/Auth/Login"));
const Register = lazy(() => import("@pages/Auth/Register"));
const UserDashboard = lazy(() => import("@pages/Dashboard/UserDashboard"));
const MyCourses = lazy(() => import("@pages/Dashboard/MyCourses"));
const Profile = lazy(() => import("@pages/Dashboard/Profile"));
const Checkout = lazy(() => import("@pages/Checkout"));
const AdminDashboard = lazy(() => import("@pages/Admin/AdminDashboard"));
const ManageCourses = lazy(() => import("@pages/Admin/ManageCourses"));
const CourseDetailAdmin = lazy(() => import("@pages/Admin/CourseDetail"));
const CourseProgress = lazy(() => import("@pages/Admin/CourseProgress"));
const ManageComments = lazy(() => import("@pages/Admin/ManageComments"));
const ManageUsers = lazy(() => import("@pages/Admin/ManageUsers"));
const ManageContacts = lazy(() => import("@pages/Admin/ManageContacts"));
const ContactProfile = lazy(() => import("@pages/Admin/ContactProfile"));
const ManageTags = lazy(() => import("@pages/Admin/ManageTags"));
const ManageEvents = lazy(() => import("@pages/Admin/ManageEvents"));
const ManageBlog = lazy(() => import("@pages/Admin/ManageBlog"));
const SalesPayments = lazy(() => import("@pages/Admin/SalesPayments"));
const SalesPricing = lazy(() => import("@pages/Admin/SalesPricing"));
const SalesCart = lazy(() => import("@pages/Admin/SalesCart"));
const DiazLara = lazy(() => import("@pages/DiazLara"));

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/acerca", element: <About /> },
      { path: "/cursos", element: <CourseList /> },
      { path: "/cursos/:slug", element: <CourseDetail /> },
      { path: "/eventos", element: <Events /> },
      {
        path: "/eventos/estrategia-fiscal",
        element: <EstrategiaFiscalLanding />,
      },
      { path: "/eventos/:slug", element: <EventDetail /> },
      { path: "/blog", element: <BlogList /> },
      { path: "/blog/:slug", element: <BlogPost /> },
      { path: "/academia", element: <Academy /> },
      { path: "/despacho", element: <DiazLara /> },
      { path: "/recursos", element: <Resources /> },
      { path: "/contacto", element: <Contact /> },
      {
        path: "/checkout",
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      {
        path: "/cursos/:slug/leccion/:lessonId",
        element: (
          <ProtectedRoute>
            <CourseLesson />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/iniciar-sesion", element: <Login /> },
      { path: "/registro", element: <Register /> },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/mi-cuenta", element: <UserDashboard /> },
      { path: "/mi-cuenta/cursos", element: <MyCourses /> },
      { path: "/mi-cuenta/perfil", element: <Profile /> },
    ],
  },
  {
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { path: "/admin", element: <AdminDashboard /> },
      { path: "/admin/productos", element: <ManageCourses /> },
      { path: "/admin/cursos", element: <ManageCourses /> },
      { path: "/admin/cursos/:id", element: <CourseDetailAdmin /> },
      { path: "/admin/cursos/:id/avance", element: <CourseProgress /> },
      { path: "/admin/comentarios", element: <ManageComments /> },
      { path: "/admin/contactos", element: <ManageContacts /> },
      { path: "/admin/contactos/:id", element: <ContactProfile /> },
      { path: "/admin/etiquetas", element: <ManageTags /> },
      { path: "/admin/usuarios", element: <ManageUsers /> },
      { path: "/admin/eventos", element: <ManageEvents /> },
      { path: "/admin/blog", element: <ManageBlog /> },
      { path: "/admin/ventas", element: <SalesPayments /> },
      { path: "/admin/ventas/pagos", element: <SalesPayments /> },
      { path: "/admin/ventas/precios", element: <SalesPricing /> },
      { path: "/admin/ventas/carrito", element: <SalesCart /> },
    ],
  },
]);
