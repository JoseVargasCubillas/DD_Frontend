import { Navigate } from 'react-router-dom';

// El registro público está deshabilitado: solo el administrador crea cuentas.
export default function Register() {
  return <Navigate to="/iniciar-sesion" replace />;
}

