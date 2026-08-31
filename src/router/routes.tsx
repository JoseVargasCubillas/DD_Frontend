import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "@templates/MainLayout";
import AuthLayout from "@templates/AuthLayout";
import DashboardLayout from "@templates/DashboardLayout";
import AdminLayout from "@templates/AdminLayout";
import Events from "@pages/Events";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import RouterErrorBoundary from "./RouterErrorBoundary";
import NotFound from "@pages/NotFound";


const Home = lazy(() => import("@pages/Home"));
const About = lazy(() => import("@pages/About"));
const CourseList = lazy(() => import("@pages/Courses/CourseList"));
const CourseDetail = lazy(() => import("@pages/Courses/CourseDetail"));
const CourseLesson = lazy(() => import("@pages/Courses/CourseLesson"));
const EstrategiaFiscalLanding = lazy(
  () => import("@pages/Events/EstrategiaFiscal"),
);
const HoldingLanding = lazy(() => import("@pages/Events/Holding"));

const EventDetail = lazy(() => import("@pages/Events/EventDetail"));
const BlogList = lazy(() => import("@pages/Blog/BlogList"));
const BlogPost = lazy(() => import("@pages/Blog/BlogPost"));
const Academy = lazy(() => import("@pages/Academy"));
const Resources = lazy(() => import("@pages/Resources"));
const Contact = lazy(() => import("@pages/Contact"));
const Login = lazy(() => import("@pages/Auth/Login"));
const Register = lazy(() => import("@pages/Auth/Register"));
const MyCourses = lazy(() => import("@pages/Dashboard/MyCourses"));
const Profile = lazy(() => import("@pages/Dashboard/Profile"));
const Checkout = lazy(() => import("@pages/Checkout"));
const EventCheckout = lazy(() => import("@pages/Events/EventCheckout"));
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
const SalesCart = lazy(() => import("@pages/Admin/SalesCart"));
const ManagePackages = lazy(() => import("@pages/Admin/ManagePackages"));
const ManageOffers = lazy(() => import("@pages/Admin/ManageOffers"));
const ManagePromotions = lazy(() => import("@pages/Admin/ManagePromotions"));
const ManageSubscriptions = lazy(() => import("@pages/Admin/ManageSubscriptions"));
const DiazLara = lazy(() => import("@pages/DiazLara"));
const ManageEmail = lazy(() => import("@pages/Admin/ManageEmail"));
const BookCheckout = lazy(() => import("@pages/Books/BookCheckout"));
const Books = lazy(() => import("@pages/Books"));
const Receipt = lazy(() => import("@pages/Receipt"));
const ReceiptOrder = lazy(() => import("@pages/ReceiptOrder"));
export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <RouterErrorBoundary />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/acerca", element: <About /> },
      { path: "/diego", element: <About /> },
      { path: "/prensa", element: <About /> },
      { path: "/cursos", element: <CourseList /> },
      { path: "/cursos/:slug", element: <CourseDetail /> },
      { path: "/eventos", element: <Events /> },
      {
        path: "/eventos/estrategia-fiscal",
        element: <EstrategiaFiscalLanding />,
      },
      { path: "/eventos/holding", element: <HoldingLanding /> },
      { path: "/eventos/holding-septiembre", element: <HoldingLanding /> },
      { path: "/eventos/holding-octubre", element: <HoldingLanding /> },
      { path: "/eventos/holding-noviembre", element: <HoldingLanding /> },
      { path: "/eventos/checkout", element: <EventCheckout /> },
      { path: "/eventos/:slug", element: <EventDetail /> },
      { path: "/blog", element: <BlogList /> },
      { path: "/blog/:slug", element: <BlogPost /> },
      { path: "/academia", element: <Academy /> },
      { path: "/despacho", element: <DiazLara /> },
      { path: "/diaz-lara", element: <DiazLara /> },
      { path: "/recursos", element: <Resources /> },
      { path: "/contacto", element: <Contact /> },
      { path: "/libros", element: <Books /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/recibo/:id", element: <Receipt /> },
      { path: "/recibo/pedido/:id", element: <ReceiptOrder /> },
      { path: "/libros/:slug/checkout", element: <BookCheckout /> },
      {
        path: "/cursos/:slug/leccion/:lessonId",
        element: (
          <ProtectedRoute>
            <CourseLesson />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    element: <AuthLayout />,
    errorElement: <RouterErrorBoundary />,
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
    errorElement: <RouterErrorBoundary />,
    children: [
      { path: "/mi-cuenta", element: <MyCourses /> },
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
    errorElement: <RouterErrorBoundary />,
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
      { path: "/admin/promociones", element: <ManagePromotions /> },
      { path: "/admin/usuarios", element: <ManageUsers /> },
      { path: "/admin/eventos", element: <ManageEvents /> },
      { path: "/admin/blog", element: <ManageBlog /> },
      { path: "/admin/ventas", element: <SalesPayments /> },
      { path: "/admin/ventas/pagos", element: <SalesPayments /> },
      { path: "/admin/ventas/precios", element: <Navigate to="/admin/suscripciones" replace /> },
      { path: "/admin/ventas/carrito", element: <SalesCart /> },
      { path: "/admin/suscripciones", element: <ManageSubscriptions /> },
      { path: "/admin/paquetes", element: <Navigate to="/admin/suscripciones" replace /> },
      { path: "/admin/ofertas", element: <Navigate to="/admin/suscripciones" replace /> },
      { path: "/admin/ventas/paquetes", element: <Navigate to="/admin/suscripciones" replace /> },
      { path: "/admin/email", element: <ManageEmail /> },
    ],
  },
]);
