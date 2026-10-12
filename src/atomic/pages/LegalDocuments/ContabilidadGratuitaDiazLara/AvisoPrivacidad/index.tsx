import {
  AcceptancePanel,
  LegalBody,
  LegalHeader,
  LegalIndex,
  useNoIndex,
  type LegalSection,
} from '../../shared';

/**
 * Aviso de Privacidad · Servicios Gratuitos de Contabilidad (Díaz Lara Contabilidad, S.C.)
 *
 * Landing legal privada: se comparte por link directo desde el formulario del
 * Diagnóstico Contable y Fiscal Gratuito. NO se enlaza desde navbar, footer ni
 * sitemap y se marca noindex al montarse.
 *
 * URL: /legal/servicios-gratuitos-contabilidad-diaz-lara/aviso-de-privacidad
 */

const sections: LegalSection[] = [
  {
    id: 'identidad',
    eyebrow: 'Responsable',
    title: 'Identidad y domicilio del responsable',
    body: [
      'DÍAZ LARA CONTABILIDAD, S.C. (en adelante, el "RESPONSABLE"), sociedad civil legalmente constituida conforme a las leyes de los Estados Unidos Mexicanos, con domicilio en Colinas del Cimatario, número 435, colonia Centro Sur, código postal 76090, Santiago de Querétaro, Querétaro, México, es responsable del tratamiento, uso, almacenamiento, conservación y protección de los datos personales que recabe de sus clientes, prospectos, representantes legales, contactos autorizados y demás titulares que mantengan una relación jurídica o comercial con la firma, en términos de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares y demás disposiciones aplicables.',
    ],
  },
  {
    id: 'objeto',
    eyebrow: 'Alcance',
    title: 'Términos y condiciones del tratamiento',
    body: [
      'El presente aviso de privacidad tiene por objeto la protección de los datos personales y datos personales sensibles, con la finalidad de regular su tratamiento legítimo, controlado e informado, a efecto de garantizar la privacidad y el derecho a la autodeterminación informativa de las personas, acorde a lo siguiente:',
    ],
  },
  {
    id: 'datos-tratados',
    eyebrow: 'Categorías de datos',
    title: 'Datos personales, financieros, patrimoniales, fiscales y demás información confidencial',
    body: [
      'Para el cumplimiento de las finalidades previstas en el presente Aviso de Privacidad, el RESPONSABLE podrá recabar y tratar, según la naturaleza de la relación jurídica y de los servicios contratados, las siguientes categorías de información:',
    ],
    blocks: [
      {
        type: 'list',
        ordered: true,
        items: [
          'Datos financieros: Información relacionada con ingresos, egresos, estados de cuenta bancarios, operaciones financieras, obligaciones de pago y demás documentación necesaria para la prestación de los servicios contratados.',
          'Datos patrimoniales: Información relacionada con bienes muebles e inmuebles, inversiones, derechos patrimoniales, participaciones societarias y demás elementos que integren el patrimonio del Titular.',
          'Datos de identificación y contexto personal o corporativo: Estado civil, nacionalidad, actividad económica, ocupación, información de representantes legales, socios, accionistas, beneficiarios controladores y contactos autorizados, cuando resulte necesaria para los servicios contratados.',
          'Información empresarial: Actividades económicas, giro comercial, estructura organizacional, número de trabajadores, operaciones comerciales, facturación, relaciones corporativas y demás información relacionada con la operación de las empresas.',
          'Información fiscal y contable: Constancias de Situación Fiscal, declaraciones fiscales, comprobantes fiscales digitales por Internet (CFDI), balanzas de comprobación, registros contables, papeles de trabajo, información de cumplimiento tributario y demás documentación necesaria para la prestación de servicios contables, fiscales y administrativos.',
          'Credenciales de acceso a plataformas fiscales: Contraseña del Servicio de Administración Tributaria (SAT), conocida como CIEC, y demás credenciales que resulten estrictamente necesarias para la ejecución de los servicios contratados, sujetas a medidas especiales de seguridad, confidencialidad y control de acceso.',
          'Imagen y voz: Información obtenida mediante videollamadas, sesiones virtuales o grabaciones, únicamente cuando resulte necesaria para el seguimiento, documentación o ejecución de los servicios, previa información al Titular.',
          'Datos personales sensibles: Excepcionalmente, aquellos datos que, por su naturaleza, se encuentren comprendidos dentro de la definición legal de datos personales sensibles y cuyo tratamiento resulte estrictamente necesario para una finalidad legítima, específica e informada.',
        ],
      },
      {
        type: 'p',
        text: 'El RESPONSABLE aplicará medidas de seguridad acordes con la naturaleza de la información tratada, restringiendo su acceso exclusivamente al personal autorizado.',
      },
      {
        type: 'p',
        text: 'El tratamiento de datos personales sensibles requerirá el consentimiento expreso y por escrito del Titular, mediante firma autógrafa, firma electrónica o cualquier mecanismo de autenticación que permita acreditar válidamente su voluntad, salvo las excepciones previstas en la legislación aplicable.',
      },
      {
        type: 'p',
        text: 'El tratamiento de datos financieros y patrimoniales se sujetará al régimen de consentimiento que legalmente corresponda, y el de credenciales de acceso a las medidas especiales de seguridad y autorización que se establezcan para su utilización.',
      },
      {
        type: 'p',
        text: 'Los datos podrán recabarse directamente del Titular o de sus representantes, mediante contratos, documentos impresos, correo electrónico, formularios digitales, sitio web, llamadas, videollamadas, WhatsApp y demás canales habilitados.',
      },
    ],
  },
  {
    id: 'credenciales',
    eyebrow: 'Credenciales SAT',
    title: 'Tratamiento y utilización de credenciales de acceso a plataformas fiscales',
    body: [
      'Cuando resulte necesario para la adecuada prestación de los servicios contables, fiscales o administrativos contratados, el RESPONSABLE podrá solicitar al Titular credenciales de acceso a plataformas electrónicas de autoridades fiscales, incluyendo la contraseña del Servicio de Administración Tributaria (SAT), conocida como CIEC.',
      'El tratamiento de dichas credenciales tendrá como finalidades exclusivas:',
    ],
    bullets: [
      'a) Consultar información fiscal, declaraciones, obligaciones tributarias y demás documentación disponible en las plataformas correspondientes.',
      'b) Verificar el cumplimiento de obligaciones fiscales y administrativas.',
      'c) Obtener constancias, acuses, comprobantes y demás información necesaria para la ejecución de los servicios contratados.',
      'd) Realizar las actividades expresamente comprendidas dentro del alcance contractual y autorizadas por el Titular.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'El acceso a dichas credenciales estará restringido al personal expresamente autorizado por el RESPONSABLE, quien deberá implementar medidas administrativas, técnicas y organizativas razonables para prevenir su acceso, uso, divulgación, alteración o pérdida no autorizados.',
      },
      {
        type: 'p',
        text: 'La entrega de credenciales no constituye por sí misma el otorgamiento de poderes de representación ni una autorización general para presentar declaraciones, modificar información fiscal, realizar trámites, asumir obligaciones o ejecutar actos jurídicos en nombre del Titular fuera del alcance de los servicios contratados.',
      },
      {
        type: 'p',
        text: 'Cuando las actividades requieran una autorización específica, ésta deberá obtenerse mediante el instrumento contractual, carta de autorización o mecanismo legal correspondiente.',
      },
      {
        type: 'p',
        text: 'El RESPONSABLE procurará que las credenciales sean recabadas y resguardadas mediante mecanismos seguros, con acceso restringido y evitando su divulgación por medios que no ofrezcan condiciones adecuadas de confidencialidad.',
      },
      {
        type: 'p',
        text: 'Las credenciales serán conservadas únicamente durante el tiempo necesario para cumplir las finalidades autorizadas y serán eliminadas de los sistemas bajo control del RESPONSABLE cuando dejen de ser necesarias, salvo que exista una obligación legal que justifique su conservación.',
      },
      {
        type: 'p',
        text: 'El Titular podrá modificar o revocar sus credenciales de acceso, sin perjuicio de las obligaciones contractuales que subsistan y de las consecuencias operativas que dicha modificación pudiera generar para la prestación del servicio.',
      },
    ],
  },
  {
    id: 'finalidades',
    eyebrow: 'Finalidades',
    title: 'Finalidades del tratamiento de los datos personales',
    body: [
      'Los datos personales proporcionados al RESPONSABLE serán tratados exclusivamente para las finalidades informadas en el presente Aviso de Privacidad, distinguiéndose entre finalidades primarias, necesarias para la existencia, mantenimiento y cumplimiento de la relación jurídica, y finalidades secundarias, que no resultan indispensables para la prestación de los servicios contratados.',
    ],
    blocks: [
      { type: 'subtitle', text: 'A. Finalidades primarias' },
      {
        type: 'p',
        text: 'El RESPONSABLE podrá tratar los datos personales para las siguientes finalidades:',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Identificar al Titular, verificar su identidad y, cuando corresponda, acreditar la personalidad de sus representantes legales.',
          'Integrar, actualizar, administrar y conservar los expedientes físicos y electrónicos de clientes y prospectos.',
          'Elaborar cotizaciones, propuestas de servicios, contratos, convenios, acuerdos de confidencialidad y demás documentación relacionada con la contratación.',
          'Prestar servicios contables, fiscales, administrativos, legales, corporativos, financieros y de consultoría, conforme al alcance contratado.',
          'Realizar registros contables, conciliaciones, determinaciones fiscales, preparación y presentación de declaraciones, cuando dichas actividades se encuentren expresamente contratadas y autorizadas.',
          'Consultar información en plataformas de autoridades fiscales, obtener documentación y verificar el cumplimiento de obligaciones tributarias.',
          'Elaborar diagnósticos, estudios de precios de transferencia, análisis fiscales, opiniones técnicas, estudios comparativos, estrategias corporativas, contratos y demás entregables relacionados con los servicios contratados.',
          'Evaluar riesgos fiscales, legales, corporativos, financieros y patrimoniales relacionados con la prestación de los servicios.',
          'Atender requerimientos, aclaraciones y procedimientos ante autoridades competentes, exclusivamente dentro del alcance de los servicios contratados y las autorizaciones correspondientes.',
          'Dar seguimiento a solicitudes, sesiones de trabajo, consultas, acuerdos, pendientes y entregables.',
          'Mantener comunicación con el Titular mediante correo electrónico, llamadas telefónicas, WhatsApp, videollamadas y demás medios autorizados.',
          'Administrar los servicios contratados, emitir comprobantes fiscales, gestionar pagos y dar seguimiento a obligaciones contractuales.',
          'Almacenar, organizar y administrar información mediante plataformas tecnológicas, herramientas digitales, servicios en la nube y sistemas internos.',
          'Implementar controles de calidad, seguridad de la información, seguimiento operativo y supervisión de los servicios.',
          'Atender solicitudes relacionadas con el ejercicio de derechos de protección de datos personales.',
          'Cumplir obligaciones legales, fiscales, administrativas y contractuales aplicables.',
          'Conservar la documentación necesaria para atender auditorías, aclaraciones, procedimientos administrativos o judiciales y ejercer o defender derechos derivados de la relación jurídica.',
        ],
      },
      { type: 'subtitle', text: 'B. Finalidades secundarias' },
      {
        type: 'p',
        text: 'Adicionalmente, y siempre que el Titular no manifieste su negativa mediante los mecanismos puestos a su disposición, sus datos de contacto podrán utilizarse para:',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Enviar información comercial, promociones, invitaciones y publicidad de servicios distintos a los contratados.',
          'Realizar encuestas de satisfacción, estudios de mercado y evaluaciones comerciales no indispensables para la prestación del servicio.',
          'Enviar invitaciones a conferencias, eventos, capacitaciones y actividades comerciales organizadas por el RESPONSABLE.',
          'Realizar actividades de prospección comercial y ofrecer nuevos servicios.',
        ],
      },
      {
        type: 'p',
        text: 'La publicación de testimonios identificables, fotografías, grabaciones o cualquier material que permita identificar al Titular con fines publicitarios requerirá la autorización específica que corresponda.',
      },
      {
        type: 'p',
        text: 'La negativa del Titular respecto de las finalidades secundarias no podrá utilizarse como motivo para negar, suspender o condicionar la prestación de los servicios contratados.',
      },
      {
        type: 'p',
        text: 'El Titular podrá manifestar desde el momento en que se recaben sus datos personales su negativa al tratamiento para finalidades secundarias, mediante los mecanismos físicos o electrónicos habilitados por el RESPONSABLE.',
      },
      {
        type: 'p',
        text: 'La negativa podrá manifestarse mediante la selección de la opción correspondiente en formularios digitales o mediante comunicación dirigida a ti@diegodiaz.mx, sin que dicha decisión afecte la prestación de los servicios solicitados.',
      },
    ],
  },
  {
    id: 'transferencias',
    eyebrow: 'Transferencias',
    title: 'Transferencias y remisiones de datos personales',
    body: [
      'El RESPONSABLE podrá realizar transferencias nacionales o internacionales de datos personales únicamente cuando resulten necesarias para el cumplimiento de las finalidades informadas, exista una disposición legal aplicable o se cuente con el consentimiento del Titular cuando éste resulte exigible.',
      'Los datos personales podrán ser transferidos, según corresponda, a:',
    ],
    bullets: [
      'a) Sociedades controladoras, subsidiarias, afiliadas o integrantes del mismo grupo empresarial del RESPONSABLE que operen bajo procesos y políticas internas comunes, cuando resulte necesario para la administración y prestación de los servicios.',
      'b) Autoridades fiscales, administrativas o judiciales competentes, cuando exista una obligación legal, requerimiento válido o autorización correspondiente.',
      'c) Notarios públicos, corredores públicos, asesores externos, especialistas y demás terceros cuya intervención resulte necesaria para la ejecución de los servicios contratados, siempre que exista una base jurídica que permita la transferencia.',
      'd) Otros terceros expresamente autorizados por el Titular para la ejecución de actividades relacionadas con la prestación de los servicios.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'Cuando una transferencia requiera el consentimiento del Titular, el RESPONSABLE deberá informarle su finalidad y permitirle manifestar su aceptación o negativa mediante los mecanismos correspondientes, antes de efectuarla.',
      },
      {
        type: 'p',
        text: 'No se requerirá consentimiento cuando la transferencia se encuentre comprendida en alguno de los supuestos de excepción establecidos en la legislación aplicable.',
      },
    ],
  },
  {
    id: 'encargados',
    eyebrow: 'Encargados',
    title: 'Remisiones a encargados del tratamiento',
    body: [
      'Para la adecuada prestación de los servicios, el RESPONSABLE podrá apoyarse en proveedores de almacenamiento en la nube, sistemas contables, plataformas de comunicación, herramientas de gestión documental y demás prestadores tecnológicos que traten datos personales por cuenta e instrucciones del RESPONSABLE.',
      'Estas remisiones deberán sujetarse a las obligaciones de confidencialidad, seguridad y tratamiento de datos personales aplicables, así como a los instrumentos jurídicos que correspondan.',
    ],
  },
  {
    id: 'terceros',
    eyebrow: 'Terceros',
    title: 'Información personal de terceros',
    body: [
      'Cuando el cliente proporcione datos personales de trabajadores, socios, accionistas, representantes legales, proveedores u otros terceros, deberá contar con una base jurídica que permita su comunicación al RESPONSABLE y cumplir las obligaciones de información y consentimiento que le correspondan.',
      'Lo anterior no exime al RESPONSABLE del cumplimiento de las obligaciones que legalmente le sean aplicables respecto de los datos personales que reciba y trate.',
    ],
  },
  {
    id: 'formularios',
    eyebrow: 'Formularios digitales',
    title: 'Recolección de información mediante formularios y plataformas digitales',
    body: [
      'El RESPONSABLE podrá recabar datos personales mediante formularios electrónicos, plataformas digitales, sistemas de gestión documental, correo electrónico y otros mecanismos tecnológicos habilitados para la contratación, integración de expedientes y prestación de los servicios.',
      'La información proporcionada por estos medios será utilizada exclusivamente para las finalidades previstas en el presente Aviso de Privacidad.',
      'El RESPONSABLE implementará medidas de seguridad administrativas, técnicas y organizativas razonables para restringir el acceso a los formularios, respuestas, bases de datos y documentos que contengan información personal, permitiendo su consulta únicamente al personal autorizado.',
      'Cuando se utilicen plataformas operadas por terceros, el tratamiento de los datos personales deberá sujetarse a los instrumentos jurídicos, configuraciones de seguridad y condiciones de tratamiento que correspondan.',
      'El RESPONSABLE procurará no solicitar contraseñas, claves privadas, archivos de firma electrónica o credenciales de acceso mediante formularios generales que no cuenten con mecanismos adecuados de protección y control de acceso.',
      'El suministro de información a través de formularios electrónicos no implica, por sí mismo, autorización para realizar actos jurídicos o fiscales en nombre del Titular fuera de los servicios contratados.',
      'El RESPONSABLE podrá conservar evidencia electrónica de la aceptación del Aviso de Privacidad y, cuando corresponda, de los consentimientos otorgados por el Titular, incluyendo fecha, hora, versión del aviso aceptada y demás elementos técnicos disponibles que permitan acreditar dicha manifestación de voluntad.',
    ],
  },
  {
    id: 'limitacion',
    eyebrow: 'Limitación de uso',
    title: 'Limitación al uso o divulgación de información personal',
    body: [
      'Respecto a finalidades que no dan origen a la relación jurídica. El Titular podrá solicitar en cualquier momento la limitación del uso o divulgación de sus datos personales para aquellas finalidades que no resulten necesarias para el mantenimiento o cumplimiento de la relación jurídica existente con el RESPONSABLE.',
      'Para ejercer este derecho, podrá presentar una solicitud mediante correo electrónico dirigido a ti@diegodiaz.mx, indicando su nombre completo, los datos de contacto correspondientes y las finalidades respecto de las cuales desea limitar el tratamiento.',
      'El RESPONSABLE dará seguimiento a dicha solicitud conforme a la legislación aplicable y comunicará al Titular la determinación correspondiente.',
      'La limitación del uso de datos personales para finalidades secundarias no afectará la prestación de los servicios contratados.',
      'Al formar parte de un grupo de WhatsApp, usted reconoce que su número telefónico y nombre de perfil, consultas o comentarios podrán ser visibles para los demás integrantes del grupo. Al aceptar ser agregado(a) y permanecer en él/(los) grupos de WhatsApp, usted otorga su consentimiento para el tratamiento de sus datos personales conforme a este aviso de privacidad. Sin embargo, usted puede solicitar en cualquier momento su salida del grupo, así como la cancelación del uso de sus datos personales, enviando un mensaje directo o a través de los medios de contacto que se le indiquen.',
      'El RESPONSABLE procurará establecer medidas razonables de confidencialidad y control respecto de los grupos de comunicación utilizados para la prestación de los servicios. Sin perjuicio de lo anterior, el Titular reconoce que la participación en grupos de mensajería puede implicar que determinados datos de identificación y contacto sean visibles para sus integrantes.',
      'El RESPONSABLE responderá por el tratamiento de datos personales que le sea legalmente atribuible, sin que la presente disposición implique una exclusión de las responsabilidades que correspondan conforme a la legislación aplicable.',
    ],
  },
  {
    id: 'arco',
    eyebrow: 'Derechos ARCO',
    title: 'Procedimiento para el ejercicio de los derechos de Acceso, Rectificación, Cancelación y Oposición (ARCO)',
    body: [
      'Para prevenir el acceso no autorizado a sus datos personales y con el fin de asegurar que la información sea utilizada para los fines establecidos en este aviso de privacidad, hemos establecido diversos procedimientos con la finalidad de evitar el uso o divulgación no autorizados de sus datos, permitiéndonos tratarlos debidamente.',
      'Todos sus datos personales son tratados de acuerdo a la legislación aplicable y vigente en el país, por ello le informamos que usted tiene en todo momento los derechos (ARCO) de acceder, rectificar, cancelar u oponerse al tratamiento que le damos a sus datos personales; derecho que podrá hacer valer a través del siguiente procedimiento:',
    ],
    blocks: [
      {
        type: 'list',
        ordered: true,
        items: [
          'Lo podrá hacer personalmente mediante entrega de la solicitud por escrito al Área de Datos Personales al siguiente domicilio: Colinas del Cimatario, número 435, Centro Sur, Código Postal 76090, Querétaro, Querétaro, de 8:00 horas a 14:00 horas de lunes a viernes, o',
          'Por medio de correo electrónico ti@diegodiaz.mx, al teléfono 442 782 4246.',
          'A través del asesor comercial asignado a usted por la empresa.',
        ],
      },
      { type: 'p', text: 'Dicha solicitud deberá contener cuando menos lo siguiente:' },
      {
        type: 'list',
        items: [
          'a) Nombre del Titular de los Datos Personales;',
          'b) Correo electrónico para recibir notificaciones;',
          'c) Documentos que acrediten su identidad o, en su caso, la representación legal del titular;',
          'd) Descripción clara y precisa de los datos personales respecto de los que se busca y del derecho que se pretende ejercer;',
          'e) Cualquier otro elemento o documento que facilite la localización de los datos personales.',
        ],
      },
      {
        type: 'p',
        text: 'En caso de que la solicitud no satisfaga alguno de los requisitos señalados anteriormente, el área correspondiente de Datos Personales podrá requerir por correo electrónico o cualquier otro medio posible, dentro de los 5 días a la recepción de la solicitud, que aporte los elementos o documentos necesarios para dar trámite a la misma. Usted contará con 10 días para atender el requerimiento; en caso de no dar respuesta en dicho plazo, se tendrá por no presentada la solicitud correspondiente.',
      },
      {
        type: 'p',
        text: 'Los plazos de atención serán de máximo 20 días contados desde la fecha en que se reciba la solicitud para comunicarle la determinación adoptada, a efecto de que, si resulta procedente, haga efectiva la misma dentro de los 15 días siguientes a la emisión de la respuesta. Los plazos antes referidos podrán ser ampliados una sola vez por un período igual, siempre y cuando así lo justifiquen las circunstancias del caso. Con la finalidad de proteger su confidencialidad, se enviará la respuesta a su solicitud al correo electrónico que haya proporcionado para tal fin y se conservará a disposición del solicitante en el domicilio señalado en el párrafo anterior.',
      },
    ],
  },
  {
    id: 'revocacion',
    eyebrow: 'Revocación',
    title: 'Revocación del consentimiento',
    body: [
      'El Titular podrá revocar en cualquier momento el consentimiento que haya otorgado para el tratamiento de sus datos personales, mediante solicitud presentada a través de los medios establecidos para el ejercicio de los derechos ARCO.',
      'La solicitud deberá identificar al Titular, señalar los datos personales y tratamientos respecto de los cuales se solicita la revocación y acompañar, cuando corresponda, la documentación necesaria para acreditar su identidad o representación legal.',
      'El RESPONSABLE analizará la procedencia de la solicitud conforme a la legislación aplicable y comunicará la determinación correspondiente.',
      'La revocación del consentimiento no tendrá efectos retroactivos y no impedirá el tratamiento de datos personales cuando éste deba continuar por disposición legal, cumplimiento de obligaciones contractuales, ejercicio o defensa de derechos u otra causa legalmente permitida.',
      'Cuando la revocación imposibilite la ejecución de actividades necesarias para la prestación de los servicios contratados, el RESPONSABLE informará al Titular las consecuencias operativas o contractuales que correspondan.',
    ],
  },
  {
    id: 'seguridad',
    eyebrow: 'Seguridad',
    title: 'Control y seguridad de información personal',
    body: [
      'DÍAZ LARA SC se compromete a tomar las providencias y/o medidas de seguridad administrativas necesarias para proteger la información obtenida, utilizando un conjunto de acciones y mecanismos para establecer la gestión, soporte y revisión de la seguridad de la información a nivel organizacional, la identificación y clasificación de la información, así como la concienciación, formación y capacitación del personal, en materia de protección de datos personales.',
      'De igual forma, DÍAZ LARA SC se compromete a llevar el conjunto de acciones y mecanismos, ya sea que empleen o no la tecnología, destinados para:',
    ],
    bullets: [
      'a) Prevenir el acceso no autorizado, el daño o interferencia a las instalaciones físicas, áreas críticas de la organización, equipo e información.',
      'b) Proteger los equipos móviles, portátiles o de fácil remoción, situados dentro o fuera de las instalaciones.',
      'c) Proveer a los equipos que contienen o almacenan datos personales de un mantenimiento que asegure su disponibilidad, funcionalidad e integridad, y',
      'd) Garantizar la eliminación de datos de forma segura.',
    ],
  },
  {
    id: 'seguridad-fiscal',
    eyebrow: 'Seguridad reforzada',
    title: 'Medidas especiales de seguridad para información fiscal y credenciales de acceso',
    body: [
      'Tratándose de información fiscal, financiera, patrimonial, documentación confidencial y credenciales de acceso a plataformas electrónicas, el RESPONSABLE establecerá medidas de seguridad proporcionales a la naturaleza de la información y a los riesgos asociados con su tratamiento.',
      'Dichas medidas comprenderán, según corresponda:',
    ],
    bullets: [
      'a) Restricción de accesos conforme a las funciones y responsabilidades del personal autorizado.',
      'b) Implementación de mecanismos de autenticación, almacenamiento protegido y control de permisos.',
      'c) Prohibición de compartir credenciales de acceso con personas no autorizadas.',
      'd) Establecimiento de obligaciones de confidencialidad para trabajadores, colaboradores, asesores y terceros que tengan acceso a la información.',
      'e) Aplicación de procedimientos para la actualización, modificación, eliminación y revocación de accesos.',
      'f) Implementación de mecanismos para la identificación, documentación y atención de incidentes de seguridad.',
      'g) Eliminación segura de credenciales y documentación cuando concluya su periodo de conservación y no exista obligación legal que justifique mantenerlas.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'En caso de presentarse una vulneración de seguridad que afecte significativamente los derechos patrimoniales o morales de las personas titulares, el RESPONSABLE realizará las notificaciones que correspondan conforme a la legislación aplicable.',
      },
    ],
  },
  {
    id: 'conservacion',
    eyebrow: 'Conservación',
    title: 'Conservación, bloqueo y eliminación de información y expedientes',
    body: [
      'El RESPONSABLE conservará los datos personales y la documentación proporcionada por el Titular únicamente durante el tiempo que resulte necesario para cumplir las finalidades que motivaron su tratamiento, así como las obligaciones legales, fiscales, administrativas y contractuales que resulten aplicables.',
      'La información podrá conservarse durante los plazos legalmente exigibles para:',
    ],
    bullets: [
      'a) Cumplir obligaciones fiscales, contables, administrativas y legales.',
      'b) Atender auditorías, verificaciones, requerimientos y procedimientos de autoridades competentes.',
      'c) Acreditar el cumplimiento de obligaciones contractuales.',
      'd) Ejercer o defender derechos derivados de la relación jurídica.',
      'e) Atender aclaraciones, reclamaciones o controversias relacionadas con los servicios prestados.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'Una vez que los datos personales dejen de ser necesarios para las finalidades que justificaron su tratamiento y hayan concluido los plazos de conservación aplicables, el RESPONSABLE procederá a su cancelación, bloqueo y posterior supresión, según corresponda conforme a la legislación vigente.',
      },
      {
        type: 'p',
        text: 'Tratándose de credenciales de acceso a plataformas fiscales, su conservación se limitará al periodo estrictamente necesario para la ejecución de las actividades autorizadas, procurando su eliminación segura cuando dejen de ser necesarias.',
      },
      {
        type: 'p',
        text: 'La terminación de la relación contractual no implicará necesariamente la eliminación inmediata de toda la documentación, cuando subsistan obligaciones legales o causas legítimas que justifiquen su conservación.',
      },
      {
        type: 'p',
        text: 'El RESPONSABLE adoptará medidas razonables para evitar la conservación indefinida o injustificada de datos personales.',
      },
    ],
  },
  {
    id: 'cambios',
    eyebrow: 'Actualizaciones',
    title: 'Cambios a este Aviso de Privacidad',
    body: [
      'El RESPONSABLE se reserva el derecho de modificar, actualizar o complementar el presente Aviso de Privacidad cuando resulte necesario para atender cambios legislativos, regulatorios, administrativos, operativos o relacionados con los servicios que presta.',
      'Las modificaciones serán comunicadas oportunamente a los Titulares mediante correo electrónico, publicación en los sitios web oficiales del RESPONSABLE o cualquier otro medio de comunicación previamente establecido.',
      'Cuando las modificaciones impliquen nuevas finalidades o tratamientos que requieran consentimiento conforme a la legislación aplicable, el RESPONSABLE recabará la autorización correspondiente antes de llevarlos a cabo.',
      'El Titular podrá consultar la versión vigente del Aviso de Privacidad a través de los medios que el RESPONSABLE habilite para tal efecto.',
    ],
  },
  {
    id: 'consentimiento',
    eyebrow: 'Consentimiento',
    title: 'Consentimiento para el tratamiento de datos personales',
    body: [
      'El tratamiento de datos personales se realizará conforme a las bases de legitimación, modalidades de consentimiento y excepciones previstas en la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.',
      'Cuando la legislación permita el consentimiento tácito, éste podrá entenderse otorgado una vez que el Aviso de Privacidad haya sido puesto a disposición del Titular y éste no manifieste su oposición.',
      'Tratándose de datos personales financieros o patrimoniales, se recabará el consentimiento expreso cuando legalmente resulte exigible.',
      'Para el tratamiento de datos personales sensibles se requerirá el consentimiento expreso y por escrito del Titular, mediante firma autógrafa, firma electrónica o cualquier mecanismo de autenticación válido que permita acreditar su voluntad, salvo las excepciones legalmente previstas.',
      'El consentimiento podrá manifestarse a través de medios físicos o electrónicos, incluyendo formularios digitales, siempre que el mecanismo utilizado resulte adecuado para la categoría de datos personales y el tipo de consentimiento requerido.',
      'La aceptación del presente Aviso de Privacidad no constituye, por sí misma, autorización para realizar actos de representación, trámites fiscales o actividades que requieran facultades o autorizaciones específicas.',
      'El RESPONSABLE podrá conservar evidencia de los consentimientos otorgados por el Titular para acreditar su obtención.',
      'El Titular reconoce haber tenido a su disposición el presente Aviso de Privacidad y haber sido informado de las finalidades, condiciones y mecanismos aplicables al tratamiento de sus datos personales.',
    ],
  },
];

export default function AvisoPrivacidadContabilidadGratuita() {
  useNoIndex('Aviso de Privacidad · Servicios Gratuitos de Contabilidad · Díaz Lara');

  return (
    <main className="bg-cream-200 text-ink-900">
      <LegalHeader
        label="Legal · Díaz Lara Contabilidad, S.C. — Servicios Gratuitos de Contabilidad"
        title="Aviso de"
        italic="privacidad"
        intro="Aviso de privacidad integral aplicable al Diagnóstico Contable y Fiscal Gratuito y demás servicios gratuitos de contabilidad ofrecidos por DÍAZ LARA CONTABILIDAD, S.C."
        meta={[
          { label: 'Responsable', value: 'Díaz Lara Contabilidad, S.C.' },
          { label: 'Domicilio', value: 'Querétaro, Querétaro' },
          { label: 'Última revisión', value: '2026' },
        ]}
      />

      <LegalIndex sections={sections} />
      <LegalBody sections={sections} />

      <div className="container-app pb-16">
        <div className="mx-auto max-w-[980px] border-t border-ink-900/15 pt-8">
          <p className="max-w-[640px] text-[13px] leading-[1.7] text-ink-500">
            Dudas sobre tus datos personales, derechos ARCO o revocación de consentimiento:
            escríbenos a{' '}
            <a
              href="mailto:ti@diegodiaz.mx"
              className="font-bold text-ink-900 underline underline-offset-4"
            >
              ti@diegodiaz.mx
            </a>{' '}
            o al{' '}
            <a href="tel:4427824246" className="font-bold text-ink-900 underline underline-offset-4">
              442 782 4246
            </a>
            . Atención de 8:00 a 14:00 horas, de lunes a viernes.
          </p>
        </div>
      </div>

      <AcceptancePanel
        storageKey="dd-privacy-contabilidad-gratuita-accepted"
        documentName="el Aviso de Privacidad de los Servicios Gratuitos de Contabilidad"
      />
    </main>
  );
}
