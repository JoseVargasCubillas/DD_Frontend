import {
  AcceptancePanel,
  LegalBody,
  LegalHeader,
  LegalIndex,
  useNoIndex,
  type LegalSection,
} from '../../shared';

/**
 * Términos y Condiciones · Diagnóstico Contable y Fiscal Gratuito
 * (Díaz Lara Contabilidad, S.C.)
 *
 * Landing legal privada: se comparte por link directo desde el formulario del
 * servicio gratuito. NO se enlaza desde navbar, footer ni sitemap y se marca
 * noindex al montarse.
 *
 * URL: /legal/servicios-gratuitos-contabilidad-diaz-lara/terminos-y-condiciones
 */

const sections: LegalSection[] = [
  {
    id: 'objeto',
    eyebrow: 'Primera',
    title: 'Objeto del servicio',
    body: [
      'Los presentes Términos y Condiciones tienen por objeto regular la participación de las personas físicas y morales (en adelante, el "PARTICIPANTE") en el servicio denominado "Diagnóstico Contable y Fiscal Gratuito", ofrecido por DÍAZ LARA CONTABILIDAD, S.C. (en adelante, "DÍAZ LARA").',
      'El servicio consiste exclusivamente en realizar una revisión preliminar y limitada de determinados aspectos de la situación fiscal del PARTICIPANTE, con base en la información proporcionada y aquella que resulte accesible mediante las plataformas electrónicas del Servicio de Administración Tributaria (SAT), conforme a las autorizaciones otorgadas.',
      'El diagnóstico tendrá un carácter exclusivamente informativo y orientativo, sin constituir una auditoría fiscal integral, dictamen, certificación, opinión legal vinculante o servicio de cumplimiento contable y fiscal.',
    ],
  },
  {
    id: 'gratuidad',
    eyebrow: 'Segunda',
    title: 'Gratuidad del servicio',
    body: [
      'El Diagnóstico Contable y Fiscal será proporcionado de manera totalmente gratuita, sin que su realización genere obligación de pago, contratación posterior o adquisición de servicios adicionales.',
      'El servicio no contempla contraprestación económica, honorarios profesionales ni cargos por la elaboración y explicación del entregable descrito en estos Términos y Condiciones.',
      'La participación no implica la celebración de un contrato de prestación continua de servicios contables, fiscales, legales, corporativos o de consultoría con DÍAZ LARA.',
      'Cualquier servicio adicional deberá ser objeto de una propuesta económica y, en su caso, de una contratación independiente y expresa.',
    ],
  },
  {
    id: 'informacion-requerida',
    eyebrow: 'Tercera',
    title: 'Información requerida',
    body: [
      'Para participar en el diagnóstico, el PARTICIPANTE deberá proporcionar, mediante el formulario electrónico habilitado por DÍAZ LARA, la siguiente información:',
    ],
    bullets: [
      'Nombre completo.',
      'Correo electrónico de contacto.',
      'Número telefónico.',
      'Registro Federal de Contribuyentes (RFC) con homoclave.',
      'Credenciales de acceso al SAT (Contraseña CIEC).',
    ],
    blocks: [
      {
        type: 'p',
        text: 'La entrega de credenciales fiscales deberá efectuarse exclusivamente mediante el mecanismo seguro que DÍAZ LARA determine y comunique al PARTICIPANTE.',
      },
      {
        type: 'p',
        text: 'El PARTICIPANTE manifiesta que la información proporcionada es veraz, actualizada y que cuenta con las facultades o autorizaciones necesarias para permitir su consulta y tratamiento.',
      },
      {
        type: 'p',
        text: 'Cuando la información corresponda a una persona moral, quien complete el formulario deberá contar con la autorización correspondiente para proporcionar sus datos y solicitar el diagnóstico.',
      },
      {
        type: 'p',
        text: 'DÍAZ LARA podrá solicitar aclaraciones estrictamente relacionadas con la información proporcionada, sin que ello implique ampliar el alcance del servicio gratuito.',
      },
    ],
  },
  {
    id: 'autorizacion',
    eyebrow: 'Cuarta',
    title: 'Autorización limitada para consultas fiscales',
    body: [
      'El PARTICIPANTE autoriza expresamente a DÍAZ LARA para utilizar las credenciales de acceso al SAT que proporcione, exclusivamente para realizar consultas y obtener información necesaria para elaborar el diagnóstico descrito en el presente documento.',
      'Esta autorización comprende únicamente actividades de consulta y verificación de información fiscal disponible en las plataformas correspondientes.',
      'Queda expresamente excluida cualquier autorización para:',
    ],
    bullets: [
      'Presentar declaraciones normales, complementarias o informativas.',
      'Modificar información fiscal o actualizar obligaciones.',
      'Presentar avisos, promociones, aclaraciones o solicitudes ante autoridades fiscales.',
      'Generar, cancelar o modificar comprobantes fiscales.',
      'Realizar pagos, compensaciones, devoluciones o cualquier otro trámite fiscal.',
      'Utilizar certificados, claves privadas o archivos de firma electrónica avanzada.',
      'Ejecutar actos de representación o asumir obligaciones en nombre del PARTICIPANTE.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'La autorización tendrá vigencia únicamente durante el periodo necesario para realizar las consultas relacionadas con el diagnóstico gratuito.',
      },
      {
        type: 'p',
        text: 'El PARTICIPANTE podrá revocar dicha autorización mediante comunicación escrita dirigida a DÍAZ LARA, sin perjuicio de que ello pueda impedir la conclusión del diagnóstico.',
      },
    ],
  },
  {
    id: 'alcance',
    eyebrow: 'Quinta',
    title: 'Alcance del diagnóstico',
    body: [
      'El servicio comprenderá exclusivamente la revisión preliminar de los siguientes tres aspectos:',
    ],
    blocks: [
      { type: 'subtitle', text: '1. Declaraciones al día' },
      {
        type: 'p',
        text: 'Revisión general del estado de presentación de las declaraciones fiscales que puedan identificarse mediante la información disponible en las plataformas del SAT, considerando las obligaciones fiscales registradas y los periodos que sean objeto de consulta.',
      },
      {
        type: 'p',
        text: 'La revisión permitirá identificar posibles declaraciones pendientes, inconsistencias visibles o situaciones que ameriten una revisión posterior.',
      },
      { type: 'subtitle', text: '2. Consistencia fiscal' },
      {
        type: 'p',
        text: 'Evaluación preliminar de la congruencia entre determinados datos fiscales disponibles para consulta, con la finalidad de identificar posibles diferencias, alertas o situaciones que requieran aclaración.',
      },
      {
        type: 'p',
        text: 'Esta revisión no comprenderá conciliaciones contables exhaustivas, verificaciones documentales integrales ni comprobación de la totalidad de las operaciones del PARTICIPANTE.',
      },
      { type: 'subtitle', text: '3. Régimen fiscal' },
      {
        type: 'p',
        text: 'Revisión general del régimen fiscal en el que se encuentra inscrito el PARTICIPANTE, considerando la información disponible en su situación fiscal y las características generales que puedan identificarse.',
      },
      {
        type: 'p',
        text: 'La revisión tendrá como finalidad detectar posibles aspectos que ameriten un análisis posterior, sin comprender un estudio de elegibilidad, comparación integral de regímenes o diseño de estrategias fiscales.',
      },
      {
        type: 'p',
        text: 'Las tres evaluaciones se efectuarán exclusivamente con base en la información disponible y efectivamente revisada por DÍAZ LARA.',
      },
    ],
  },
  {
    id: 'entregable',
    eyebrow: 'Sexta',
    title: 'Entregable y sistema de evaluación',
    body: [
      'Como resultado del diagnóstico, DÍAZ LARA elaborará un reporte ejecutivo que contendrá una evaluación de los tres aspectos señalados en la cláusula anterior, utilizando un sistema visual de semáforo.',
      'Los indicadores tendrán el siguiente significado:',
    ],
    bullets: [
      'VERDE: No se identificaron alertas relevantes dentro del alcance y la información efectivamente revisados.',
      'AMARILLO: Se identificaron posibles inconsistencias, información insuficiente o aspectos que requieren aclaración o revisión adicional.',
      'ROJO: Se identificaron alertas relevantes, posibles incumplimientos o situaciones que ameritan atención prioritaria y, en su caso, una revisión especializada.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'Cada indicador estará acompañado de una explicación breve sobre los elementos observados que justifican la clasificación asignada.',
      },
      {
        type: 'p',
        text: 'La clasificación tendrá carácter exclusivamente preliminar y no constituirá una determinación definitiva sobre el cumplimiento de las obligaciones fiscales del PARTICIPANTE.',
      },
      {
        type: 'p',
        text: 'La asignación de un indicador verde no implica que el PARTICIPANTE se encuentre en cumplimiento absoluto de sus obligaciones fiscales ni garantiza la inexistencia de errores, omisiones, contingencias o riesgos fiscales.',
      },
      {
        type: 'p',
        text: 'Asimismo, los indicadores amarillo o rojo no constituyen por sí mismos una determinación de infracciones, créditos fiscales o incumplimientos legalmente acreditados.',
      },
    ],
  },
  {
    id: 'entrega',
    eyebrow: 'Séptima',
    title: 'Entrega de resultados',
    body: [
      'El reporte ejecutivo será enviado exclusivamente por medios electrónicos al correo proporcionado por el PARTICIPANTE en el formulario de registro.',
      'El envío del documento constituirá la entrega formal del diagnóstico gratuito.',
      'DÍAZ LARA no estará obligada a realizar entregas físicas, emitir dictámenes firmados, elaborar informes complementarios o proporcionar documentación adicional distinta del entregable expresamente descrito.',
    ],
  },
  {
    id: 'sesion',
    eyebrow: 'Octava',
    title: 'Sesión de explicación de resultados',
    body: [
      'Como parte del servicio gratuito, DÍAZ LARA ofrecerá una sesión virtual de explicación de resultados, con una duración máxima de 30 (treinta) minutos.',
      'La sesión tendrá como finalidad:',
    ],
    bullets: [
      'Explicar los indicadores del semáforo asignados.',
      'Exponer brevemente las principales observaciones identificadas.',
      'Aclarar dudas directamente relacionadas con el contenido del reporte.',
      'Señalar, cuando corresponda, los aspectos que podrían requerir una revisión profesional adicional.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'La sesión se realizará exclusivamente en modalidad virtual, mediante la plataforma electrónica que DÍAZ LARA determine, en la fecha y horario acordados conforme a la disponibilidad de ambas partes.',
      },
      {
        type: 'p',
        text: 'El servicio incluye una sola sesión de explicación, sin obligación de celebrar reuniones adicionales, brindar asesoría continua o atender consultas posteriores.',
      },
    ],
  },
  {
    id: 'exclusiones',
    eyebrow: 'Novena',
    title: 'Servicios expresamente excluidos',
    body: [
      'El PARTICIPANTE reconoce y acepta que el Diagnóstico Contable y Fiscal Gratuito no comprende ni incluye, de manera enunciativa y no limitativa, los siguientes servicios:',
    ],
    bullets: [
      'Registro, elaboración, actualización, regularización o administración de contabilidad.',
      'Cálculo, determinación, preparación o presentación de declaraciones fiscales normales, complementarias, informativas o anuales.',
      'Corrección de errores, omisiones, inconsistencias o incumplimientos fiscales.',
      'Elaboración, implementación o seguimiento de estrategias de optimización o planeación fiscal.',
      'Elaboración o revisión de contratos, convenios, actas corporativas o documentos jurídicos.',
      'Auditorías fiscales, contables, financieras, laborales o corporativas integrales.',
      'Elaboración de estudios de precios de transferencia, dictámenes, opiniones técnicas o informes especializados.',
      'Representación, gestión o atención de procedimientos ante el SAT o cualquier otra autoridad.',
      'Atención de requerimientos, cartas invitación, revisiones electrónicas, auditorías o facultades de comprobación.',
      'Cálculos de impuestos, conciliaciones contables y fiscales, reconstrucción de operaciones o revisión exhaustiva de CFDI.',
      'Trámites de inscripción, actualización o modificación del RFC, régimen fiscal u obligaciones tributarias.',
      'Seguimiento periódico de obligaciones, monitoreo fiscal o acompañamiento posterior a la entrega de resultados.',
      'Cualquier otra actividad no expresamente contemplada en la cláusula quinta de estos Términos y Condiciones.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'La identificación de alertas, riesgos o posibles incumplimientos durante el diagnóstico no generará para DÍAZ LARA obligación alguna de corregirlos, subsanarlos, gestionarlos o darles seguimiento.',
      },
    ],
  },
  {
    id: 'limitaciones',
    eyebrow: 'Décima',
    title: 'Naturaleza y limitaciones de los resultados',
    body: [
      'El PARTICIPANTE reconoce que el diagnóstico constituye una revisión preliminar y limitada, elaborada con base en la información disponible al momento de su realización.',
      'En consecuencia:',
    ],
    bullets: [
      'Los resultados podrán variar si posteriormente se obtiene información adicional, se corrigen registros fiscales o se identifican circunstancias no conocidas durante la revisión.',
      'El diagnóstico no garantiza la detección de la totalidad de errores, omisiones, incumplimientos o contingencias fiscales.',
      'El reporte no constituye una certificación de cumplimiento fiscal ni sustituye las obligaciones de revisión y cumplimiento que correspondan al contribuyente.',
      'Las observaciones no constituyen instrucciones para ejecutar operaciones fiscales o jurídicas sin una evaluación profesional adicional.',
      'El PARTICIPANTE conserva la responsabilidad que legalmente le corresponda respecto del cumplimiento de sus obligaciones fiscales.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'DÍAZ LARA responderá exclusivamente por las obligaciones que legalmente le resulten atribuibles con motivo de la ejecución del servicio gratuito, dentro del alcance expresamente establecido.',
      },
      {
        type: 'p',
        text: 'No asumirá obligaciones de prestación de servicios adicionales, corrección de incumplimientos, representación fiscal ni seguimiento posterior, salvo contratación independiente.',
      },
      {
        type: 'p',
        text: 'Ninguna disposición de estos Términos y Condiciones deberá interpretarse como una exclusión de responsabilidad por actos u omisiones que legalmente sean imputables a DÍAZ LARA.',
      },
    ],
  },
  {
    id: 'obligaciones',
    eyebrow: 'Décima primera',
    title: 'Obligaciones del participante',
    body: ['El PARTICIPANTE se obliga a:'],
    bullets: [
      'Proporcionar información veraz, completa y actualizada.',
      'Contar con facultades suficientes para autorizar las consultas fiscales correspondientes.',
      'Facilitar oportunamente la información estrictamente necesaria para el diagnóstico.',
      'Revisar los resultados recibidos y determinar, bajo su responsabilidad, las acciones posteriores que estime pertinentes.',
      'Abstenerse de presentar el reporte como una certificación, dictamen fiscal o constancia oficial de cumplimiento.',
      'Utilizar los canales de comunicación habilitados para el servicio.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'El incumplimiento de estas obligaciones podrá impedir o limitar la elaboración del diagnóstico.',
      },
    ],
  },
  {
    id: 'disponibilidad',
    eyebrow: 'Décima segunda',
    title: 'Disponibilidad y conclusión del servicio',
    body: [
      'DÍAZ LARA podrá establecer periodos de registro, cupos de atención y disponibilidad de agenda para la prestación del servicio gratuito, los cuales deberán informarse oportunamente a los participantes.',
      'La elaboración del diagnóstico estará sujeta a la recepción de la información necesaria y a la disponibilidad de acceso a las plataformas correspondientes.',
      'DÍAZ LARA podrá suspender o no concluir el diagnóstico cuando exista información insuficiente, imposibilidad técnica de acceso, falta de autorización o cualquier circunstancia objetiva que impida su ejecución, informándolo al PARTICIPANTE.',
      'El servicio se considerará concluido una vez enviado el reporte ejecutivo y celebrada la sesión virtual de explicación de resultados.',
      'En caso de que el PARTICIPANTE decida no asistir a la sesión o manifieste que no desea recibirla, el servicio se considerará concluido con la entrega del reporte.',
    ],
  },
  {
    id: 'confidencialidad',
    eyebrow: 'Décima tercera',
    title: 'Confidencialidad y protección de datos personales',
    body: [
      'DÍAZ LARA tratará la información recibida con carácter confidencial y exclusivamente para las finalidades informadas y autorizadas.',
      'Los datos personales serán tratados conforme al Aviso de Privacidad Integral de DÍAZ LARA CONTABILIDAD, S.C., puesto a disposición del PARTICIPANTE mediante el formulario de registro.',
      'El tratamiento de información personal, financiera, patrimonial y fiscal estará sujeto a las medidas de seguridad y disposiciones legales aplicables.',
      'La aceptación de estos Términos y Condiciones no sustituye los consentimientos específicos que deban recabarse conforme a la legislación de protección de datos personales.',
    ],
  },
  {
    id: 'servicios-adicionales',
    eyebrow: 'Décima cuarta',
    title: 'Contratación de servicios adicionales',
    body: [
      'En caso de que el diagnóstico identifique situaciones que requieran regularización, corrección, análisis especializado o acompañamiento profesional, DÍAZ LARA podrá informar al PARTICIPANTE sobre la posibilidad de contratar servicios adicionales.',
      'La contratación será completamente voluntaria y estará sujeta a una propuesta económica independiente, aceptación expresa y formalización de los documentos contractuales correspondientes.',
      'La participación en el diagnóstico gratuito no implica compromiso de contratación ni autoriza cargos o cobros posteriores.',
    ],
  },
  {
    id: 'aceptacion',
    eyebrow: 'Décima quinta',
    title: 'Aceptación de los Términos y Condiciones',
    body: [
      'El PARTICIPANTE manifiesta que ha leído, comprendido y aceptado los presentes Términos y Condiciones antes de solicitar el servicio.',
      'La aceptación podrá realizarse mediante mecanismos electrónicos habilitados por DÍAZ LARA que permitan conservar evidencia de la manifestación de voluntad.',
      'La aceptación comprende el conocimiento de la naturaleza gratuita, el alcance limitado del diagnóstico, los entregables incluidos, las exclusiones y las condiciones para su prestación.',
      'La autorización para consultar información fiscal mediante credenciales del SAT deberá recabarse expresamente y de forma diferenciada, de manera que pueda acreditarse el alcance de las actividades autorizadas.',
    ],
  },
  {
    id: 'legislacion',
    eyebrow: 'Décima sexta',
    title: 'Legislación aplicable y solución de controversias',
    body: [
      'Los presentes Términos y Condiciones se interpretarán conforme a la legislación aplicable del Estado de Querétaro.',
      'Cualquier controversia relacionada con la prestación del servicio será atendida inicialmente mediante comunicación directa entre las partes, procurando una solución de buena fe.',
      'Cuando resulte necesaria la intervención de una autoridad, serán competentes las autoridades que correspondan conforme a la legislación aplicable, sin perjuicio de los derechos irrenunciables que pudieran corresponder al PARTICIPANTE.',
    ],
  },
];

export default function TerminosContabilidadGratuita() {
  useNoIndex('Términos y Condiciones · Diagnóstico Contable y Fiscal Gratuito · Díaz Lara');

  return (
    <main className="bg-cream-200 text-ink-900">
      <LegalHeader
        label="Legal · Díaz Lara Contabilidad, S.C. — Servicios Gratuitos de Contabilidad"
        title="Términos y"
        italic="condiciones"
        intro="Diagnóstico Contable y Fiscal Gratuito. Condiciones que regulan la participación de personas físicas y morales en el servicio gratuito ofrecido por DÍAZ LARA CONTABILIDAD, S.C."
        meta={[
          { label: 'Prestador', value: 'Díaz Lara Contabilidad, S.C.' },
          { label: 'Jurisdicción', value: 'Querétaro, Querétaro' },
          { label: 'Última revisión', value: '2026' },
        ]}
      />

      <LegalIndex sections={sections} />
      <LegalBody sections={sections} />

      <div className="container-app pb-16">
        <div className="mx-auto max-w-[980px] border-t border-ink-900/15 pt-8">
          <p className="max-w-[640px] text-[13px] leading-[1.7] text-ink-500">
            El tratamiento de tus datos personales se rige por el{' '}
            <a
              href="/legal/servicios-gratuitos-contabilidad-diaz-lara/aviso-de-privacidad"
              className="font-bold text-ink-900 underline underline-offset-4"
            >
              Aviso de Privacidad de los Servicios Gratuitos de Contabilidad
            </a>
            . Dudas:{' '}
            <a
              href="mailto:contacto@diegodiaz.mx"
              className="font-bold text-ink-900 underline underline-offset-4"
            >
              contacto@diegodiaz.mx
            </a>
            .
          </p>
        </div>
      </div>

      <AcceptancePanel
        storageKey="dd-terms-contabilidad-gratuita-accepted"
        documentName="los Términos y Condiciones del Diagnóstico Contable y Fiscal Gratuito"
      />
    </main>
  );
}
