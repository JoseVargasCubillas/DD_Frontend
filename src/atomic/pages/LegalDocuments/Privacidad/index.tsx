import { AcceptancePanel, LegalBody, LegalHeader, LegalIndex, type LegalSection } from '../shared';

const sections: LegalSection[] = [
  {
    id: 'identidad',
    eyebrow: 'Responsable',
    title: 'Identidad y domicilio del responsable',
    body: [
      'Diego Díaz, Persona Física con Actividad Empresarial y Profesional, con domicilio ubicado en Colinas del Cimatario, número 435, Centro Sur, Código Postal 76090, Querétaro, Querétaro.',
    ],
  },
  {
    id: 'objeto',
    eyebrow: 'Alcance',
    title: 'Términos y condiciones del tratamiento',
    body: [
      'El presente aviso de privacidad tiene por objeto la protección de los datos personales y datos personales sensibles, con la finalidad de regular su tratamiento legítimo, controlado e informado, a efecto de garantizar la privacidad y el derecho a la autodeterminación informativa de las personas.',
      'Los datos personales y datos personales sensibles (incluyendo su imagen personal) de nuestros consumidores, asistentes, usuarios, prospectos y/o clientes, son tratados de forma estrictamente privada y confidencial, por lo que la obtención, tratamiento, transferencia y ejercicio de los derechos derivados de dichos datos personales se hace mediante un uso adecuado, legítimo y lícito, salvaguardando permanentemente los principios de licitud, consentimiento, información, calidad, finalidad, proporcionalidad, responsabilidad y lealtad, de conformidad con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, su Reglamento y disposiciones secundarias.',
      'Los datos personales podrán ser obtenidos por una fuente de acceso público, formato impreso, por medio electrónico, óptico, sonoro, visual, o a través de cualquier otra tecnología. Al proporcionar sus datos personales y datos personales sensibles para las actividades señaladas en el presente aviso, el Titular concede su consentimiento cuando nos los proporciona directamente a través de nuestras redes sociales oficiales (Facebook, Instagram, TikTok, WhatsApp a través de nuestros asesores comerciales), al visitar el sitio de internet, y a través de otras fuentes permitidas por la ley.',
    ],
  },
  {
    id: 'datos-tratados',
    eyebrow: 'Categorías de datos',
    title: 'Datos personales y datos personales sensibles tratados',
    body: [
      'El Titular acepta y otorga libremente su consentimiento para el tratamiento de los datos personales, al proporcionar por cualquier medio y de manera voluntaria la información y documentación siguiente:',
    ],
    bullets: [
      'Nombre completo',
      'Dirección',
      'Registro Federal de Contribuyentes (RFC)',
      'Teléfono',
      'Correo electrónico',
    ],
  },
  {
    id: 'datos-especiales',
    eyebrow: 'Tratamiento especial',
    title: 'Datos personales de tratamiento especial',
    bullets: [
      'Datos de pago y facturación (necesarios para procesar cobros, emitir CFDI y conciliar pagos).',
      'Datos de envío (domicilio, referencias, persona que recibe), cuando se adquieran libros físicos.',
      'Imagen y voz (fotografías, videos y grabaciones durante cursos, seminarios o capacitaciones presenciales o en línea).',
    ],
  },
  {
    id: 'finalidades',
    eyebrow: 'Uso de los datos',
    title: 'Información y prestación de servicios',
    body: [
      'El Titular acepta y otorga su consentimiento para que el responsable pueda tratar sus datos personales y datos personales sensibles anteriormente enlistados, para las siguientes finalidades necesarias para cumplir con las obligaciones derivadas de la relación jurídica:',
    ],
    bullets: [
      'Evaluación, mejoramiento, administración, procuración y otorgamiento de todos los servicios que ofrecemos (incluyendo el diseño y desarrollo de nuevos servicios) y realizar las actividades más adecuadas a su necesidad.',
      'Validar la veracidad y calidad de la información proporcionada por usted, incluyendo la verificación de sus datos.',
      'Participar, cumplir y dar seguimiento a los procedimientos y actividades previstos en guías, procedimientos, reglamentos, normas, códigos o políticas de carácter interno.',
      'Enviarle información sobre seminarios, capacitaciones, asesorías y demás servicios de valor ético y profesional.',
      'En caso de solicitarlo, inscribirlo en eventos como seminarios, capacitaciones, asesorías y demás servicios integrales, así como enviarle notificaciones relativas al evento o actividad en el que participará.',
      'Para la venta de libros: procesar pedidos y pagos; emitir comprobantes fiscales o de pago; gestionar envíos y entregas; dar contacto por incidencias de compra/entrega; atender dudas, aclaraciones, cambios o devoluciones; y cumplir obligaciones legales.',
      'Aplicar encuestas y evaluaciones relacionadas con la calidad de nuestros servicios.',
      'Llevar un expediente electrónico para control y organización interna y, cuando aplique, un registro de su historial acorde a las necesidades durante el desarrollo de los servicios que adquiera.',
      'Durante eventos, cursos, seminarios o capacitaciones, el Titular podrá ser fotografiado y/o videograbado exclusivamente con fines académicos, informativos, institucionales y de difusión del evento, sin que ello implique cesión de derechos patrimoniales sobre su imagen. El Titular podrá solicitar la limitación o revocación del uso de su imagen para publicaciones futuras.',
      'Atender, registrar y dar seguimiento a reportes, solicitudes o recomendaciones que sirvan de apoyo para la mejora de los servicios ofrecidos.',
      'Si usted utiliza nuestras plataformas, gestionar su perfil, permitir su interacción y recomendarle servicios con fines educativos, académicos y de capacitación.',
    ],
  },
  {
    id: 'finalidades-secundarias',
    eyebrow: 'Consentimiento opcional',
    title: 'Finalidades secundarias',
    body: [
      'En relación con estos tratamientos, usted podrá ejercer, en caso de así desearlo, los derechos de acceso y rectificación de su información personal conforme al procedimiento previsto en la sección de Derechos ARCO y Revocación de consentimiento de este Aviso.',
    ],
    bullets: [
      'Análisis de la información y datos relacionados con su persona mediante procesos automatizados y técnicas de análisis de datos que nos permitan conocer mejor su perfil, aptitudes e intereses.',
      'Difusión de felicitaciones, testimonios especiales, así como reconocimientos por logros destacados.',
      'Envío de campañas, publicidad y comunicaciones con fines de prospección comercial de productos y servicios propios, a través de diversos medios y canales de comunicación tanto físicos como electrónicos.',
    ],
  },
  {
    id: 'transferencia',
    eyebrow: 'Terceros',
    title: 'Transferencia de datos',
    body: [
      'El Titular reconoce y acepta que los datos personales facilitados podrán ser comunicados a las empresas que forman parte del mismo grupo empresarial del responsable, ya sea que operen bajo los mismos procesos y políticas internas, con la finalidad de cumplir con la relación jurídica existente, así como para fines administrativos, operativos, comerciales, de análisis, estadísticos, financieros, de contacto y/o de mejora en la prestación de servicios.',
      'En todo caso, las empresas del grupo tratarán los datos personales conforme a lo señalado en este Aviso de Privacidad, asumiendo las mismas obligaciones que correspondan al responsable y lo dispuesto en la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, su Reglamento y demás disposiciones aplicables, adoptando las medidas técnicas y organizativas necesarias para garantizar su seguridad, confidencialidad e integridad, sin utilizarlos para finalidades distintas de las aquí indicadas.',
      'El interesado podrá ejercer sus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad mediante comunicación dirigida al correo contacto@expertoenimpuestos.com o al teléfono 4611111009.',
      'El consentimiento será expreso, previo e informado para el tratamiento de imagen y voz del Titular. Para datos personales no sensibles, el consentimiento será tácito cuando, habiéndose puesto a disposición el Aviso, el Titular no manifieste su oposición.',
    ],
  },
  {
    id: 'revocacion-imagen',
    eyebrow: 'Imagen y voz',
    title: 'Revocación del consentimiento para el uso de imagen y voz',
    body: [
      'El Titular podrá, en cualquier momento, revocar el consentimiento otorgado para el uso de su imagen y/o voz, mediante solicitud expresa enviada al correo electrónico contacto@expertoenimpuestos.com, indicando su nombre completo, el material respecto del cual solicita la revocación y una descripción clara de su petición.',
      'La revocación surtirá efectos únicamente hacia el futuro y no tendrá efectos retroactivos sobre el material previamente publicado o difundido, salvo que legalmente proceda su eliminación. El Responsable dará respuesta a la solicitud conforme a los plazos previstos en la legislación aplicable.',
    ],
  },
  {
    id: 'cookies',
    eyebrow: 'Tecnologías de rastreo',
    title: 'Uso de cookies, píxeles de seguimiento y tecnologías similares',
    body: [
      'Las cookies son pequeñas piezas de información que son enviadas por el sitio web a su navegador. Las cookies utilizadas pueden ser propias o de terceros, y pueden clasificarse como necesarias, de rendimiento, funcionales y/o publicitarias, las cuales permiten, entre otras cosas, recordar preferencias del usuario, obtener información estadística sobre el uso del sitio y mostrar contenido relevante.',
      'Las cookies se almacenan en el disco duro de su equipo y se utilizan para determinar sus preferencias cuando se conecta a los servicios de nuestros sitios, así como para rastrear determinados comportamientos o actividades llevadas a cabo por usted dentro de nuestros sitios.',
      'En nuestro sitio web utilizamos cookies, píxeles y/u otras tecnologías a través de las cuales es posible monitorear su comportamiento como usuario de internet, así como brindarle un mejor servicio y experiencia al navegar en nuestro sitio.',
      'El usuario puede aceptar, rechazar o configurar el uso de cookies, píxeles y/u otras tecnologías a través de la configuración de su navegador o mediante el banner de cookies del sitio web. Las cookies no necesarias serán utilizadas únicamente con el consentimiento del Titular a través del banner correspondiente.',
    ],
  },
  {
    id: 'limitacion',
    eyebrow: 'Control del titular',
    title: 'Limitación al uso o divulgación de información personal',
    body: [
      'La limitación de los datos personales solo podrá utilizarse para los fines establecidos en este aviso de privacidad. Para que usted pueda limitar el uso y divulgación de su información personal respecto a finalidades que no dan origen a la relación jurídica, puede solicitarlo al correo electrónico contacto@expertoenimpuestos.com o al teléfono 4611111009, indicando la información, el o los correos electrónicos y/o números telefónicos que requieren su limitación.',
    ],
  },
  {
    id: 'arco',
    eyebrow: 'Derechos ARCO',
    title: 'Procedimiento para el ejercicio de los derechos ARCO',
    body: [
      'Para prevenir el acceso no autorizado a sus datos personales y asegurar que la información sea utilizada para los fines establecidos en este aviso, hemos establecido diversos procedimientos con la finalidad de evitar el uso o divulgación no autorizados de sus datos.',
      'Usted tiene en todo momento los derechos de Acceder, Rectificar, Cancelar u Oponerse (ARCO) al tratamiento que le damos a sus datos personales, mediante el siguiente procedimiento:',
    ],
    bullets: [
      'Personalmente, mediante entrega de la solicitud por escrito al Área de Datos Personales en Colinas del Cimatario, número 435, Centro Sur, Código Postal 76090, Querétaro, Querétaro, de 8:00 a 14:00 horas de lunes a viernes.',
      'Por correo electrónico a contacto@expertoenimpuestos.com o al teléfono 4611111009.',
      'A través del asesor comercial asignado a usted por la empresa.',
    ],
  },
  {
    id: 'arco-requisitos',
    eyebrow: 'Requisitos',
    title: 'Contenido de la solicitud y plazos de atención',
    body: [
      'Dicha solicitud deberá contener cuando menos lo siguiente:',
    ],
    bullets: [
      'Nombre del Titular de los datos personales.',
      'Correo electrónico para recibir notificaciones.',
      'Documentos que acrediten su identidad o, en su caso, la representación legal del titular.',
      'Descripción clara y precisa de los datos personales respecto de los que se busca ejercer el derecho correspondiente.',
      'Cualquier otro elemento o documento que facilite la localización de los datos personales.',
    ],
  },
  {
    id: 'arco-plazos',
    eyebrow: 'Tiempos de respuesta',
    title: 'Plazos del procedimiento ARCO',
    body: [
      'En caso de que la solicitud no satisfaga alguno de los requisitos señalados, el área correspondiente podrá requerirle, dentro de los 5 días siguientes a su recepción, que aporte los elementos o documentos necesarios para dar trámite a la misma. Usted contará con 10 días para atender el requerimiento; de no responder en dicho plazo, se tendrá por no presentada la solicitud.',
      'Los plazos de atención serán de máximo 20 días contados desde la recepción de la solicitud para comunicarle la determinación adoptada, a efecto de que, si resulta procedente, se haga efectiva dentro de los 15 días siguientes a la respuesta. Estos plazos podrán ampliarse una sola vez por un período igual, cuando así lo justifiquen las circunstancias del caso. La respuesta se enviará al correo electrónico que haya proporcionado para tal fin.',
    ],
  },
  {
    id: 'seguridad',
    eyebrow: 'Protección de datos',
    title: 'Control y seguridad de la información personal',
    body: [
      'Diego Díaz se compromete a tomar las providencias y medidas de seguridad administrativas necesarias para proteger la información obtenida, mediante acciones y mecanismos para la gestión, soporte y revisión de la seguridad de la información a nivel organizacional, la identificación y clasificación de la información, así como la concienciación, formación y capacitación del personal en materia de protección de datos personales.',
    ],
    bullets: [
      'Prevenir el acceso no autorizado, el daño o interferencia a las instalaciones físicas, áreas críticas de la organización, equipo e información.',
      'Proteger los equipos móviles, portátiles o de fácil remoción, situados dentro o fuera de las instalaciones.',
      'Proveer a los equipos que contienen o almacenan datos personales de un mantenimiento que asegure su disponibilidad, funcionalidad e integridad.',
      'Garantizar la eliminación de datos de forma segura.',
    ],
  },
  {
    id: 'cambios',
    eyebrow: 'Vigencia del aviso',
    title: 'Cambios a este Aviso de Privacidad',
    body: [
      'El presente Aviso podrá ser modificado por Diego Díaz. Las modificaciones se informarán a través de los medios de contacto proporcionados por el Titular y/o por los canales oficiales del Responsable. Se recomienda revisar periódicamente este Aviso.',
      'El Responsable requiere el consentimiento expreso del Titular para el tratamiento de su imagen y voz, el cual podrá manifestarse mediante firma autógrafa, firma electrónica, aceptación digital o participación voluntaria en el evento. Para datos personales no sensibles, se entenderá otorgado el consentimiento tácito cuando, habiéndose puesto a disposición el Aviso de Privacidad, el Titular no manifieste su oposición.',
      'Me doy por enterado y acepto los términos del presente Aviso, y en caso contrario lo comunicaré al Responsable por los medios señalados.',
    ],
  },
];

export default function Privacidad() {
  return (
    <main className="bg-cream-200 text-ink-900">
      <LegalHeader
        label="Legal · Diego Díaz — Estrategia Fiscal"
        title="Aviso de"
        italic="privacidad"
        intro="Documento de privacidad aplicable a los servicios educativos, seminarios, capacitaciones y venta de libros ofrecidos por Diego Díaz."
        meta={[
          { label: 'Responsable', value: 'Diego Díaz' },
          { label: 'Domicilio', value: 'Querétaro, Querétaro' },
          { label: 'Última revisión', value: '2026' },
        ]}
      />

      <LegalIndex sections={sections} />
      <LegalBody sections={sections} />

      <div className="container-app pb-16">
        <div className="mx-auto max-w-[980px] border-t border-ink-900/15 pt-8">
          <p className="max-w-[640px] text-[13px] leading-[1.7] text-ink-500">
            Dudas sobre tus datos personales, derechos ARCO o revocación de consentimiento de
            imagen y voz: escríbenos a{' '}
            <a href="mailto:contacto@expertoenimpuestos.com" className="font-bold text-ink-900 underline underline-offset-4">
              contacto@expertoenimpuestos.com
            </a>{' '}
            o al{' '}
            <a href="tel:4611111009" className="font-bold text-ink-900 underline underline-offset-4">
              461 111 1009
            </a>
            .
          </p>
        </div>
      </div>

      <AcceptancePanel storageKey="dd-privacy-accepted" documentName="el Aviso de Privacidad" />
    </main>
  );
}
