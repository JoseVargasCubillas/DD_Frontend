import { Navigate } from 'react-router-dom';

// Registro público desactivado — solo el admin crea cuentas y envía credenciales por email.
export default function Register() {
  return <Navigate to="/iniciar-sesion" replace />;
}

