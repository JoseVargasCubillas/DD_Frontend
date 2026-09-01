import { FaqPageShell, type FaqCategory } from '../shared';

const categories: FaqCategory[] = [
  {
    id: 'cat-diego',
    title: 'Diego Díaz y Díaz Lara',
    items: [
      {
        question: '¿Quién es Diego Díaz?',
        answer:
          'Diego Díaz es Licenciado en Contaduría y Finanzas, especializado en derecho corporativo y estrategia fiscal. Es autor de tres libros — "Los 7 secretos que el SAT no quiere que conozcas", "7 secretos de un fiscalista" y "7 claves para cobrar a tu empresa" — y conferencista especializado en estrategia fiscal para empresarios y dueños de negocio.',
      },
      {
        question: '¿Qué es Díaz Lara?',
        answer:
          'Es la firma detrás de Diego Díaz: un equipo certificado como Great Place to Work® y reconocido con el Sello de Plata de Latin American Excellence in Law Awards, enfocado en educación fiscal y contable para empresarios.',
      },
      {
        question: '¿A quién está dirigido el contenido y los programas de Diego Díaz?',
        answer:
          'A emprendedores, empresarios y profesionistas que buscan que su empresa opere con legalidad, eficiencia fiscal y crecimiento sostenido — no está pensado como servicio contable operativo tradicional, sino como educación y estrategia de alto nivel.',
      },
      {
        question: '¿Diego Díaz ofrece servicios de contabilidad o solo capacitación?',
        answer:
          'El sitio está enfocado en educación, estrategia y capacitación (libros, eventos, Academia). Para consultoría directa o casos específicos de tu empresa, el canal es contactar a un asesor por WhatsApp.',
      },
    ],
  },
  {
    id: 'cat-academia',
    title: 'Academia',
    items: [
      {
        question: '¿Qué es Academia?',
        answer:
          'Es la plataforma de streaming de Díaz Lara: acceso a más de 120 horas de clases en video sobre planeación fiscal, contabilidad empresarial, obligaciones tributarias, auditorías, finanzas corporativas y cumplimiento normativo, impartidas por expertos fiscales y contables.',
      },
      {
        question: '¿Qué planes existen y qué diferencia hay entre ellos?',
        answer:
          'Hay tres planes — Entrepreneur, Business y Master — todos con acceso ilimitado a los cursos de la plataforma. La diferencia principal está en el nivel de acompañamiento: Entrepreneur incluye un consultor especialista asignado, Business un consultor senior con reportes de avance detallados, y Master incluye mentoría directa con el CEO.',
      },
      {
        question: '¿Cuánto cuesta la membresía de Academia?',
        answer:
          'Los precios se cotizan de forma personalizada según el plan y el tamaño de tu empresa. Para conocer el costo exacto, un asesor te atiende directamente por WhatsApp.',
      },
      {
        question: '¿El contenido de Academia se actualiza?',
        answer:
          'Sí, la membresía incluye contenido nuevo cada mes, además de descargables, contenido exclusivo y sesiones Mastermind.',
      },
      {
        question: '¿Puedo cancelar o cambiar de plan?',
        answer:
          'Puedes solicitar la cancelación de tu suscripción en cualquier momento con tu asesor; se hace efectiva al concluir el periodo ya pagado, sin penalización adicional. El cambio entre planes (Entrepreneur, Business, Master) no es automático dentro de la plataforma — se gestiona directamente con tu consultor asignado.',
      },
    ],
  },
  {
    id: 'cat-eventos',
    title: 'Capacitaciones y eventos',
    items: [
      {
        question: '¿Qué diferencia hay entre un "evento" y una "capacitación"?',
        answer:
          'Los eventos (como los que aparecen en el calendario 2026) suelen ser sesiones puntuales, presenciales u online, sobre un tema específico — por ejemplo, Holding o Reformas fiscales. Las capacitaciones son programas más estructurados dentro de la oferta de Diego Díaz.',
      },
      {
        question: '¿Las capacitaciones son presenciales, online o ambas?',
        answer:
          'Ambas modalidades están disponibles según el evento — el sitio indica claramente si cada fecha es online o en una ciudad específica, por ejemplo CDMX o Querétaro.',
      },
      {
        question: '¿Cómo me registro a un evento?',
        answer:
          'Desde la página de Eventos, cada fecha tiene su propio botón de registro, que dirige a una landing page específica o directo a checkout para asegurar tu lugar.',
      },
    ],
  },
  {
    id: 'cat-libros',
    title: 'Libros',
    items: [
      {
        question: '¿Qué libros ha publicado Diego Díaz?',
        answer:
          'Tres: "Los 7 secretos que el SAT no quiere que conozcas", "7 secretos de un fiscalista" y "7 claves para cobrar a tu empresa".',
      },
      {
        question: '¿Dónde puedo comprar los libros?',
        answer: 'Directamente desde la sección de Libros del sitio, con pago seguro vía Stripe.',
      },
      {
        question: '¿Los libros están disponibles en formato digital?',
        answer:
          'No, actualmente los tres libros se venden únicamente en formato físico (pasta blanda o pasta dura), impresos en México, con envío a domicilio incluido en el checkout.',
      },
    ],
  },
  {
    id: 'cat-pagos',
    title: 'Pagos, acceso y soporte',
    items: [
      {
        question: '¿Qué métodos de pago aceptan?',
        answer:
          'Los libros y eventos se procesan de forma segura vía Stripe (tarjeta de crédito o débito). Para Academia, el proceso de pago se define al hablar con un asesor.',
      },
      {
        question: '¿Cómo contacto a un asesor?',
        answer:
          'El canal principal es WhatsApp — enlace disponible en los botones "Contacta un asesor" a lo largo del sitio — o a través del formulario en la página de Contacto.',
      },
      {
        question: '¿Dónde veo las próximas fechas de eventos?',
        answer: 'En la página de Eventos, que incluye el calendario completo 2026 con fechas y ciudades disponibles.',
      },
      {
        question: '¿Cómo accedo a mi cuenta si ya soy alumno o suscriptor?',
        answer: 'Desde el botón "Iniciar sesión" en la parte superior del sitio, con el correo y contraseña con los que te registraste.',
      },
    ],
  },
];

export default function Faq() {
  return <FaqPageShell categories={categories} />;
}
