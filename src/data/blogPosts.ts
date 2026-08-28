// Registro estático de los boletines históricos de Diego Díaz, reescritos y
// formateados para el blog. La lista se muestra en `/blog` y cada slug abre
// `/blog/:slug` (ver BlogPost). Los posts locales tienen prioridad sobre el API.

import reformaCover from '../../assets/ddweb/reforma-fiscal-2026.jpg';
import satCover from '../../assets/ddweb/sat-cumplimiento-digital.jpg';
import blindajeCover from '../../assets/ddweb/blindaje-digital.jpg';
import equipoCover from '../../assets/ddweb/equipo-unido.jpg';
import inmobiliarioCover from '../../assets/ddweb/inmobiliario-construccion.jpg';
import recibosCover from '../../assets/ddweb/recibos-deducibles.jpg';

export type BlogAuthor = {
  name: string;
  role?: string;
};

export type StaticBlogPost = {
  slug: string;
  title: string;
  tag: string;
  publishedAt: string;      // ISO date
  readTimeMin: number;
  excerpt: string;
  image: string;
  author: BlogAuthor;
  tags?: string[];
  html: string;
};

const DIEGO: BlogAuthor = {
  name: 'Diego Alberto Díaz Robles',
  role: 'Licenciado en Contaduría Pública y Finanzas · Autor del libro "7 secretos de un fiscalista"',
};

const JULIA: BlogAuthor = {
  name: 'Julia Yael Trens Lanz',
  role: 'Analista de Estudio de Precios de Transferencia',
};

const JAZMIN: BlogAuthor = {
  name: 'Mtra. Jazmín Robles Del Valle',
  role: 'Abogada Fiscal',
};

export const STATIC_BLOG_POSTS: StaticBlogPost[] = [
  {
    slug: 'reformas-fiscales-vs-amenazas-fiscales-2025',
    title: 'Reformas fiscales vs amenazas fiscales: ¿cómo afectan a las empresas en México?',
    tag: 'SAT & reformas',
    publishedAt: '2025-02-07',
    readTimeMin: 8,
    excerpt:
      'El Plan Maestro del SAT y la actualización de aranceles al 19% marcan el rumbo del sexenio. Qué significa para tu empresa y cómo convertir el riesgo en oportunidad.',
    image: reformaCover,
    author: DIEGO,
    tags: ['SAT', 'Plan Maestro', 'Reforma fiscal', 'Estrategia'],
    html: `
<p class="lead">El Gobierno de México ha tomado decisiones estratégicas que marcan el rumbo económico del sexenio. Frente a Estados Unidos y China, el país optó por fortalecer su relación con EE.UU., como lo demuestra la actualización de <strong>aranceles al 19%</strong> sobre importaciones provenientes de naciones sin tratados de libre comercio. Este movimiento responde en parte a la presión del expresidente Donald Trump, quien amenazó con aumentar aranceles a México y obligó al país a redoblar esfuerzos para proteger su economía.</p>

<p>Simultáneamente, el Servicio de Administración Tributaria (SAT) ha desplegado su <em>"Plan Maestro"</em>, una estrategia fiscal que ha permitido aumentar significativamente la recaudación en los últimos años. Este plan refleja un enfoque multifacético que combina tecnología, supervisión y acción jurídica.</p>

<h2>Los 4 ejes principales del Plan Maestro</h2>
<ol>
  <li><strong>Monitoreo de obligaciones fiscales y patronales</strong>: identificar y corregir irregularidades en el cumplimiento.</li>
  <li><strong>Supervisión en el sector energético</strong>: detectar inconsistencias en la comercialización y distribución de combustibles.</li>
  <li><strong>Tecnología para combatir irregularidades</strong>: uso de modelos estadísticos avanzados para identificar empresas "factureras" y patrones sospechosos en importadores.</li>
  <li><strong>Control de devoluciones atípicas</strong>: vigilancia estricta de solicitudes de devolución de IVA, IEPS e ISR.</li>
</ol>

<h2>Estrategias implementadas</h2>
<ul>
  <li><strong>Litigio estratégico:</strong> casos ante tribunales federales para enfrentar a contribuyentes incumplidos.</li>
  <li><strong>Operativos contra el contrabando:</strong> fiscalización exhaustiva de comercio exterior.</li>
  <li><strong>Colaboración con la FGR:</strong> perseguir defraudación fiscal, contrabando y emisión de comprobantes falsos.</li>
  <li><strong>Profesionalización del personal:</strong> combatir la corrupción desde dentro.</li>
</ul>

<h2>2025: ¿oportunidad o amenaza?</h2>
<p>Las autoridades fiscales soportarán su postura frente a quienes buscan evadir la ley. Para quienes cumplen con las reglas es una oportunidad de operar en un entorno más justo y transparente; para quienes han ignorado sus obligaciones, el riesgo de consecuencias legales es inminente.</p>

<h2>Reflexión final</h2>
<p>¿Cómo está preparada tu empresa para este contexto? ¿Estás optimizando tus estrategias fiscales y cumpliendo con tus obligaciones legales? Contar con un plan robusto será clave para evitar riesgos innecesarios.</p>

<p>Si quieres entender cómo las reformas fiscales y las estrategias del SAT pueden impactar a tu negocio y convertir desafíos en oportunidades, te invito al <a href="/eventos/estrategia-fiscal"><em>seminario Estrategia Fiscal</em></a>, donde compartimos herramientas prácticas para enfrentar estos cambios con éxito.</p>
`,
  },

  {
    slug: 'navegando-la-incertidumbre-fiscal-estrategias-empresarios',
    title: 'Navegando la incertidumbre fiscal: estrategias para empresarios en tiempos de inestabilidad',
    tag: 'Ensayo largo',
    publishedAt: '2024-11-12',
    readTimeMin: 7,
    excerpt:
      'La sobreexposición a redes sociales lleva a decisiones apresuradas. Antes de mudar tu residencia fiscal, evalúa tu blindaje. El miedo crea oportunidades.',
    image: blindajeCover,
    author: DIEGO,
    tags: ['Blindaje', 'Estrategia', 'Residencia fiscal', 'Rockefeller'],
    html: `
<p class="lead">La incertidumbre jurídica y económica en México preocupa a muchos empresarios, especialmente ante las advertencias de ciertos grupos inversionistas que han decidido pausar sus inversiones en el país. Con varios indicadores económicos en contra, algunos temen que se avecine una recesión.</p>

<p>Es natural que, en medio de este panorama, se considere cambiar de residencia fiscal o incluso mudarse a otro país. Sin embargo, recuerda que la <strong>sobreexposición a información de redes sociales, noticias y medios</strong> puede llevarnos a decisiones apresuradas. Aunque México atraviesa un período complejo, esta no es la crisis más difícil que los empresarios hayan enfrentado.</p>

<p>Muchos ya están evaluando opciones como la <em>Visa de inversionista en Estados Unidos</em> o la <em>Golden Visa en Europa</em>, pero es importante analizar si huir por miedo a perder patrimonio es la decisión más prudente. Los empresarios más experimentados entienden que <strong>el miedo crea oportunidades</strong>: adquirir empresas a precios reducidos, mientras otros compran inmuebles en el extranjero a precios inflados.</p>

<p>¿Te queda claro? No se trata de quedarse o irse, sino de <strong>moverse con estrategia y datos claros</strong>. Reflexiona también en el impacto que tendrá tu decisión en la cultura de tu empresa y en tus colaboradores. Si decides irte, ¿qué mensaje reciben? ¿Seguirán confiando en tu liderazgo o serán atraídos por aquellos que se quedan y aprovechan las oportunidades?</p>

<p>A pesar de la incertidumbre, la solución siempre existe: un <strong>blindaje financiero efectivo</strong>. Aprovecha estos momentos para aprender y aplicar estrategias que, lejos de ser una amenaza, te revelarán nuevas oportunidades de crecimiento y estabilidad.</p>
`,
  },

  {
    slug: 'holding-aplicacion-construccion',
    title: 'Holding y su aplicación en el giro de la construcción',
    tag: 'Casos reales',
    publishedAt: '2024-11-08',
    readTimeMin: 9,
    excerpt:
      'Cómo cobrarte a tu empresa, cómo pagar diferencias de nómina y qué hacer con las "comisiones". Los tres puntos que más piden los dueños de constructoras.',
    image: inmobiliarioCover,
    author: DIEGO,
    tags: ['Holding', 'Construcción', 'Nómina', 'SBC'],
    html: `
<p class="lead">¿Sabías que el sector de la construcción asume demasiados riesgos fiscales? Y si trabajas en proyectos para el gobierno, más aún.</p>

<p>En mi carrera como consultor y estratega fiscal, es común que ayude a dueños de negocios y directores con tres puntos específicos:</p>
<ol>
  <li>Cómo cobrar a su empresa</li>
  <li>Cómo pagar diferencias de nómina</li>
  <li>Cómo entregar "comisiones"</li>
</ol>

<h2>Punto 3 · Comisiones</h2>
<p>No existe una fórmula mágica para resolver ciertos temas, sobre todo cuando la normativa ya es clara. Todo lo relacionado con comisiones debe estar respaldado por un comprobante fiscal. Entregar "comisiones" por no llamarlas por su verdadero nombre podría tipificarse como <strong>cohecho</strong>, según el Código Penal Federal.</p>

<h2>Punto 2 · Cómo pagar diferencias de nómina</h2>
<p>Muchos contribuyentes no aprovechan los conceptos excluidos del <strong>Salario Base de Cotización (SBC)</strong>, según el artículo 27 de la Ley del Seguro Social. Algunos de estos conceptos son:</p>
<ul>
  <li>Ahorro</li>
  <li>Alimentación</li>
  <li>Habitación</li>
  <li>Premios por puntualidad y asistencia</li>
  <li>Despensas</li>
</ul>
<p>Estos conceptos podrían duplicar la percepción del salario del trabajador. Sin embargo, es fundamental contar con especialistas que te ayuden a cumplir con las obligaciones laborales y fiscales que surgen al otorgar dichas prestaciones.</p>

<h2>Punto 1 · Cómo cobrar a tu empresa</h2>
<p>Actualmente, seis de cada diez empresarios cobran vía <em>asimilados</em>, mientras que los otros cuatro lo hacen a través de nómina, honorarios o arrendamiento.</p>
<p>La forma ideal de cobrar depende de la actividad de la empresa: puede ser cobrando una comisión por contratos cerrados, o en organizaciones más grandes a través de una comisión por utilidades derivada del cargo de director.</p>
<p>Es esencial una asesoría adecuada para evitar problemas con las autoridades. En caso de auditoría, el SAT podría considerar estas comisiones como <strong>dividendos</strong>, mientras que el IMSS podría tratarlas como <strong>sueldos</strong>. De ahí la importancia de una estrategia fiscal bien fundamentada.</p>
`,
  },

  {
    slug: 'precios-de-transferencia-consideraciones-empresas',
    title: 'Precios de transferencia: consideraciones para empresas con partes relacionadas',
    tag: 'Estrategia fiscal',
    publishedAt: '2024-04-24',
    readTimeMin: 10,
    excerpt:
      'Declaración maestra, local, país por país, cadena de suministro, APA y reestructuras: la ruta completa para cumplir con el principio de plena competencia.',
    image: satCover,
    author: JULIA,
    tags: ['Precios de transferencia', 'Partes relacionadas', 'Multinacionales'],
    html: `
<p class="lead">Se viven diversos cambios en los mercados derivados del comercio internacional, por lo que surge la necesidad indispensable de acción y protección de las bases tributarias. Esto ha resultado en una mayor fiscalización en materia de precios de transferencia.</p>

<blockquote>El término de precios de transferencia se refiere a las contraprestaciones pactadas en las transacciones entre partes relacionadas. Estos convenios pueden implicar la cesión de bienes tangibles e intangibles, tales como tecnología, marcas, servicios, financiamiento, arrendamiento, entre otros.</blockquote>

<p>Las leyes y normas de precios de transferencia son aplicables a contribuyentes que realizan transacciones con partes relacionadas nacionales o extranjeras. Estas normativas disponen que el beneficio bruto se determine conforme al <strong>principio de plena competencia</strong> (arm's length): no debe dar lugar a beneficios extremos y su tratamiento se enfoca en un precio de transferencia equitativo.</p>

<h2>Consideraciones clave</h2>

<h3>Declaración maestra</h3>
<p>Proporciona una visión general de los grupos multinacionales. Tras la Acción 13 en la LISR, debe contener información global del grupo, con posibilidad de presentarse por línea de negocio.</p>

<h3>Declaración local</h3>
<p>La compañía detalla la información correspondiente a las operaciones específicas dentro del grupo para asegurar a las autoridades el cumplimiento del principio de plena competencia.</p>

<h3>Declaración país por país (CBCR)</h3>
<p>Requiere información detallada de asignación de renta, impuestos pagados e indicadores de actividad económica entre jurisdicciones. Evita escenarios de doble tributación.</p>

<h3>Análisis de cadena de suministro</h3>
<p>Integra los temas fiscales como componente del proceso total del negocio, generando ahorros a largo plazo y economías de escala.</p>

<h3>Aplicación práctica</h3>
<p>Involucra tres aspectos: <strong>procesos, tecnología y personal</strong>. Alinea la ejecución con la estrategia y mejora la veracidad de los registros intercompañía.</p>

<h3>Documentación</h3>
<p>Permite soportar los acuerdos y transferir la carga de la prueba a las autoridades. Requiere una estrategia robusta que proteja la rentabilidad del negocio y que cuente con <strong>materialidad</strong> de todas las operaciones.</p>

<h3>Acuerdos de precios anticipados (APA)</h3>
<p>Los contribuyentes pueden solicitar al SAT la confirmación de la metodología más adecuada. Pueden ser unilaterales o bilaterales, y brindan certeza jurídica.</p>

<h3>Reestructuras de negocios</h3>
<p>Las organizaciones evolucionan y reestructuran para adaptarse. Es importante tener visión de los efectos en precios de transferencia y de las implicaciones de cumplimiento local: revelación de esquemas reportables, Forma 76, valor de transferencia de intangibles/acciones, pagos al extranjero y REFIPRES.</p>
`,
  },

  {
    slug: 'te-expulsaron-del-resico-persona-fisica',
    title: '¿Te expulsaron del RESICO siendo persona física?',
    tag: 'Casos reales',
    publishedAt: '2024-02-24',
    readTimeMin: 6,
    excerpt:
      'Cómo impugnar la resolución del SAT que te saca del Régimen Simplificado de Confianza, dentro de los 30 días hábiles, y qué implicaciones tiene no hacerlo.',
    image: recibosCover,
    author: JAZMIN,
    tags: ['RESICO', 'Defensa fiscal', 'Persona física'],
    html: `
<p class="lead">Este régimen está fundamentado en el Título IV, Capítulo II, Sección IV, de la LISR: los contribuyentes personas físicas que se dediquen exclusivamente a actividades empresariales, profesionales o al arrendamiento de bienes tienen la opción de tributar en el <strong>RESICO-PF</strong>, siempre y cuando la suma total de sus ingresos del año anterior no supere los <strong>$3,500,000</strong>.</p>

<p>Sin embargo, el SAT ha expulsado de este régimen a personas físicas por no presentar su declaración anual o superar el límite de ingresos, obligándolas a tributar en el Régimen de Actividades Empresariales y Profesionales.</p>

<h2>¿Qué puedes hacer si te expulsaron?</h2>
<p>Conforme al artículo 23 de la Ley Federal de los Derechos del Contribuyente, la resolución es impugnable por:</p>
<ol>
  <li>Recurso de revocación (art. 116 del CFF), dentro de <strong>30 días hábiles</strong> siguientes a la notificación.</li>
  <li>Juicio contencioso administrativo ante el Tribunal Federal de Justicia Administrativa, en vía tradicional o en línea, también dentro de <strong>30 días hábiles</strong>.</li>
</ol>

<p>Con una asesoría legal óptima puedes:</p>
<ul>
  <li>Permanecer tributando en el RESICO-PF.</li>
  <li>Evitar pagar el ISR a una tasa elevada de manera retroactiva.</li>
</ul>

<h2>Si no interpones defensa, considera:</h2>
<ul>
  <li>El RESICO-PF no admite deducciones; al cambiar de régimen aumentará la base gravable.</li>
  <li>Las retenciones en RESICO son del <strong>1.25%</strong>, en otros regímenes del <strong>10%</strong>, generando inconsistencias.</li>
  <li>Los CFDI emitidos indican el régimen; técnicamente habría que reemplazarlos todos.</li>
</ul>

<p>El artículo 6 del CFF establece que las contribuciones se causan conforme se realizan las situaciones jurídicas o de hecho previstas en las leyes vigentes en ese momento. Por lo tanto, la autoridad no podría solicitar la reexpedición de CFDI ni aplicar retenciones distintas si se respeta esta disposición. La Resolución Miscelánea Fiscal 2023 podría contravenir los principios de <em>reserva de ley</em> y <em>subordinación jerárquica</em>.</p>

<p>La regla 3.13.5. de la RMF 2024 establece la obligación de presentar el aviso de actualización de actividades económicas al dejar de tributar en el RESICO-PF.</p>
`,
  },

  {
    slug: 'gastos-restaurantes-deducibles',
    title: 'Gastos en restaurantes: ¿deducibles contra impuestos?',
    tag: 'Estrategia fiscal',
    publishedAt: '2023-08-23',
    readTimeMin: 7,
    excerpt:
      'Cuándo deduces el 100% y cuándo solo el 8.5%. La diferencia entre un gasto de viaje y una reunión con clientes, con la minuta que tienes que anexar.',
    image: equipoCover,
    author: DIEGO,
    tags: ['Deducciones', 'Restaurantes', 'ISR', 'Gastos de viaje'],
    html: `
<p class="lead">Si tienes actividad empresarial, ya seas persona física o moral, seguro te has topado con asesores contables con distintos puntos de vista: unos piden mínimo de kilometraje entre el restaurante y tu establecimiento, otros se hacen de la vista gorda. En este ensayo te comparto cómo funcionan estos gastos y sus fundamentos.</p>

<p>Como premisa: los gastos en restaurantes para ser deducibles cumplen el requisito principal de ser <strong>"estrictamente indispensables"</strong> para la obtención de ingresos o para cumplir los fines de la actividad del contribuyente.</p>

<h2>Ejemplo 1 · Gastos de viaje</h2>
<p>Si vas de viaje a entregar mercancía o prestar un servicio y te detienes a comer, es un gasto de viaje.</p>
<p><strong>¿Es deducible?</strong> Sí, si cumples:</p>
<ol>
  <li>Consumo fuera de una faja de <strong>50 km</strong> (radio de 50 kms según tesis), con comprobante de transporte u hospedaje.</li>
  <li>Pago con tarjeta o medios electrónicos cuando solo tengas comprobante de transporte.</li>
  <li>Importe máximo <strong>$750 pesos diarios</strong> por beneficiario, o <strong>$1,500 pesos</strong> en el extranjero.</li>
</ol>
<p>¿Y si no lograste los 50 km de radio? Sólo se deduce el <strong>8.5%</strong> del consumo, siempre que el pago sea con tarjeta o medios electrónicos.</p>

<h2>Ejemplo 2 · Reunión con clientes</h2>
<p>Cuando llevas a cabo una reunión de negocios sueles pactar acuerdos, afinar puntos de un contrato o negociar. Si consumen alimentos y bebidas en el lugar de la reunión, deberás ser tú como proveedor de los bienes o servicios quien pague la cuenta y la haga deducible.</p>

<p>Independiente del kilometraje. La misma LISR que prohíbe ciertas deducciones también establece los <em>cómo sí</em>:</p>
<blockquote>Los obsequios, atenciones y otros gastos de naturaleza análoga con excepción de aquéllos que estén directamente relacionados con la enajenación de productos o la prestación de servicios y que sean ofrecidos a los clientes en forma general.</blockquote>

<p>De contar con el soporte de que dicho consumo se realizó con la finalidad de un acto mercantil o civil, es del todo deducible sin necesidad de kilometraje mínimo. Aunque se recomienda considerar el criterio de proporcionalidad (tesis VIII-CASE-JL-3, RTFJA, Octava Época, No. 47, oct 2020).</p>

<h2>Soporte necesario</h2>
<ul>
  <li>Minuta con lugar, personas reunidas, puntos discutidos, planes de acción y firmas.</li>
  <li>Anexar copia del ticket de consumo a la minuta.</li>
  <li>Llevar expediente de estas reuniones por cliente.</li>
  <li>Registro contable en gastos generales o de venta, subcuenta <em>atención a clientes</em>.</li>
</ul>
`,
  },
];

const MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export function formatStaticBlogDate(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getUTCDate()).padStart(2, '0')} ${MONTHS_ES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function findStaticBlogPost(slug: string): StaticBlogPost | undefined {
  return STATIC_BLOG_POSTS.find((post) => post.slug === slug);
}
