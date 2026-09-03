import { useEffect } from 'react';
import './styles.css';

/**
 * Terminos y condiciones · Servicios de Arquitectura Fiscal, Juridica y Patrimonial
 * (Diaz Lara)
 *
 * Landing legal standalone. Sirve para enviarse por link directo al cliente
 * como parte de una contratacion. NO se enlaza desde el navbar, footer ni
 * sitemap, y se marca noindex para que buscadores no la listen.
 *
 * URL de acceso: /legal/arquitectura-integral-diaz-lara
 */
export default function TerminosArquitectura() {
  useEffect(() => {
    // Robots noindex — evita que el documento aparezca en Google.
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow, noarchive';
    document.head.appendChild(robots);

    const prevTitle = document.title;
    document.title = 'Términos y condiciones · Arquitectura fiscal · Diego Díaz';

    // Reveal on scroll — replica del script del wireframe.
    let observer: IntersectionObserver | null = null;
    const els = document.querySelectorAll<HTMLElement>('.arq-legal .reveal');
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer?.unobserve(entry.target);
          }
        });
      }, { threshold: 0.10, rootMargin: '0px 0px -80px 0px' });
      els.forEach((el) => observer!.observe(el));
    } else {
      els.forEach((el) => el.classList.add('in'));
    }

    return () => {
      observer?.disconnect();
      robots.remove();
      document.title = prevTitle;
    };
  }, []);

  return (
    <div className="arq-legal js">
      {/* NAV */}
      <nav className="site-nav">
        <div className="nav-inner">
          <a href="/" className="nav-brand">Diego <span className="it">Díaz.</span></a>
          <div className="nav-items">
            <a href="/diego">Sobre nosotros</a>
            <a href="/libros">Tienda</a>
            <a href="/cursos">Capacitaciones</a>
            <a href="/eventos">Eventos</a>
            <a href="/academia">Miembros</a>
            <a href="/blog">Contenido gratuito</a>
            <a href="/contacto">Contacto</a>
          </div>
          <a href="/iniciar-sesion" className="nav-cta">
            Iniciar sesión <span>→</span>
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-eyebrow">
            <span><span className="n">— 00</span> · Documento legal · Vigente</span>
            <span>Díaz Lara · Arquitectura fiscal</span>
          </div>
          <h1 className="hero-title reveal">
            Términos y <span className="it">condiciones.</span>
          </h1>
          <div className="hero-sub reveal d1">
            — Servicios de arquitectura fiscal, jurídica y patrimonial
          </div>
          <p className="hero-copy reveal d2">
            Los presentes términos y condiciones regulan la prestación de los servicios estratégicos,
            fiscales, jurídicos, corporativos y patrimoniales ofrecidos por{' '}
            <strong>Díaz Lara</strong> (en adelante &ldquo;EL PRESTADOR&rdquo;).
          </p>

          <div className="doc-meta reveal d3">
            <div className="doc-meta-item">
              <span className="lbl">— Prestador</span>
              <span className="val">Díaz Lara.</span>
            </div>
            <div className="doc-meta-item">
              <span className="lbl">— Documento</span>
              <span className="val">17 cláusulas.</span>
            </div>
            <div className="doc-meta-item">
              <span className="lbl">— Jurisdicción</span>
              <span className="val">Querétaro, Qro.</span>
            </div>
            <div className="doc-meta-item">
              <span className="lbl">— Vigencia</span>
              <span className="val">Al momento de contratación.</span>
            </div>
          </div>
        </div>
      </section>

      {/* DOC */}
      <section className="doc">
        <div className="container">
          <div className="doc-wrap">
            {/* TOC */}
            <aside className="toc">
              <div className="toc-lbl">— Índice del documento</div>
              <ol className="toc-list">
                <li><a href="#s1"><span className="n">01</span><span>Objeto de los servicios</span></a></li>
                <li><a href="#s2"><span className="n">02</span><span>Naturaleza del servicio</span></a></li>
                <li><a href="#s3"><span className="n">03</span><span>Alcance general</span></a></li>
                <li><a href="#s4"><span className="n">04</span><span>Limitación de alcances</span></a></li>
                <li><a href="#s5"><span className="n">05</span><span>Información proporcionada por el cliente</span></a></li>
                <li><a href="#s5b"><span className="n">05·B</span><span>Plazo para entrega de información</span></a></li>
                <li><a href="#s6"><span className="n">06</span><span>Carácter preliminar de las recomendaciones</span></a></li>
                <li><a href="#s7"><span className="n">07</span><span>Confidencialidad</span></a></li>
                <li><a href="#s8"><span className="n">08</span><span>Propiedad intelectual</span></a></li>
                <li><a href="#s9"><span className="n">09</span><span>Honorarios y formas de pago</span></a></li>
                <li><a href="#s9b"><span className="n">09·B</span><span>Escalamiento de servicios</span></a></li>
                <li><a href="#s10"><span className="n">10</span><span>Reprogramaciones y cancelaciones</span></a></li>
                <li><a href="#s11"><span className="n">11</span><span>Tiempos de respuesta</span></a></li>
                <li><a href="#s12"><span className="n">12</span><span>No garantía de resultados</span></a></li>
                <li><a href="#s13"><span className="n">13</span><span>Responsabilidad limitada</span></a></li>
                <li><a href="#s14"><span className="n">14</span><span>Relación independiente</span></a></li>
                <li><a href="#s15"><span className="n">15</span><span>Medios electrónicos</span></a></li>
                <li><a href="#s16"><span className="n">16</span><span>Jurisdicción</span></a></li>
                <li><a href="#s17"><span className="n">17</span><span>Aceptación</span></a></li>
              </ol>
            </aside>

            {/* Article */}
            <article className="art">
              <div className="sect reveal" id="s1">
                <div className="sect-num">Cláusula 01</div>
                <h2 className="sect-title">Objeto de los <span className="it">servicios.</span></h2>
                <div className="sect-body">
                  <p>Los presentes términos y condiciones regulan la prestación de los servicios estratégicos, fiscales, jurídicos, corporativos y patrimoniales ofrecidos por Díaz Lara (en adelante &ldquo;EL PRESTADOR&rdquo;).</p>
                  <p>Los servicios tienen como finalidad brindar orientación estratégica, revisión preliminar, identificación de riesgos y recomendaciones ejecutivas relacionadas con estructuras fiscales, corporativas, financieras y patrimoniales.</p>
                </div>
              </div>

              <div className="sect reveal" id="s2">
                <div className="sect-num">Cláusula 02</div>
                <h2 className="sect-title">Naturaleza del <span className="it">servicio.</span></h2>
                <div className="sect-body">
                  <p className="lead-in">EL CLIENTE reconoce y acepta que los servicios contratados:</p>
                  <ul>
                    <li>Son de carácter preventivo, estratégico y consultivo.</li>
                    <li>Se basan en análisis preliminares de la información proporcionada.</li>
                    <li>No constituyen auditorías fiscales, financieras o legales.</li>
                    <li>No garantizan resultados fiscales, financieros o patrimoniales específicos.</li>
                    <li>No sustituyen obligaciones legales, fiscales o contables del cliente.</li>
                  </ul>
                </div>
              </div>

              <div className="sect reveal" id="s3">
                <div className="sect-num">Cláusula 03</div>
                <h2 className="sect-title">Alcance <span className="it">general.</span></h2>
                <div className="sect-body">
                  <p className="lead-in">Los servicios podrán incluir:</p>
                  <ul>
                    <li>Revisión fiscal preliminar.</li>
                    <li>Revisión jurídica y corporativa.</li>
                    <li>Evaluación patrimonial.</li>
                    <li>Identificación de riesgos.</li>
                    <li>Recomendaciones estratégicas.</li>
                    <li>Posibles metodologías aplicables.</li>
                    <li>Retroalimentación ejecutiva.</li>
                    <li>Diagnóstico inicial o ejecutivo.</li>
                  </ul>
                  <p>El alcance específico dependerá del nivel de servicio contratado.</p>
                </div>
              </div>

              <div className="sect reveal" id="s4">
                <div className="sect-num">Cláusula 04</div>
                <h2 className="sect-title">Limitación de <span className="it">alcances.</span></h2>
                <div className="sect-body">
                  <p className="lead-in">Salvo pacto expreso por escrito, los servicios <strong>no incluyen</strong>:</p>
                  <ul>
                    <li>Implementación jurídica.</li>
                    <li>Elaboración de contratos.</li>
                    <li>Protocolizaciones notariales.</li>
                    <li>Constitución de sociedades.</li>
                    <li>Trámites ante autoridades.</li>
                    <li>Defensa fiscal o litigio.</li>
                    <li>Auditorías fiscales o financieras.</li>
                    <li>Servicios contables operativos.</li>
                    <li>Dictámenes fiscales.</li>
                    <li>Implementación internacional.</li>
                    <li>Elaboración de estudios especializados.</li>
                  </ul>
                  <p>Cualquier servicio adicional será cotizado por separado.</p>
                </div>
              </div>

              <div className="sect reveal" id="s5">
                <div className="sect-num">Cláusula 05</div>
                <h2 className="sect-title">Información proporcionada <span className="it">por el cliente.</span></h2>
                <div className="sect-body">
                  <p className="lead-in">EL CLIENTE será responsable de:</p>
                  <ul>
                    <li>Proporcionar información completa, veraz y actualizada.</li>
                    <li>Entregar documentación suficiente para el análisis.</li>
                    <li>Informar adecuadamente la operación real del negocio.</li>
                    <li>Notificar cualquier dato relevante que pueda impactar el análisis.</li>
                  </ul>
                  <p>EL CLIENTE reconoce y acepta que el análisis, observaciones y recomendaciones serán elaborados con base en la información efectivamente proporcionada al momento de la revisión.</p>
                  <p>En caso de que la información entregada sea incompleta, parcial, desactualizada o insuficiente, EL PRESTADOR no será responsable por omisiones, limitaciones o conclusiones derivadas de dicha falta de información, pudiendo desahogarse la revisión con los elementos disponibles.</p>
                </div>
              </div>

              <div className="sect reveal" id="s5b">
                <div className="sect-num">Cláusula 05 · Bis</div>
                <h2 className="sect-title">Plazo para entrega <span className="it">de información.</span></h2>
                <div className="sect-body">
                  <p>EL CLIENTE contará con un plazo máximo de <strong>60 (sesenta) días naturales</strong> contados a partir de la contratación del servicio para compartir la información y documentación requerida para el análisis correspondiente.</p>
                  <p className="lead-in">En caso de no proporcionarse la información completa dentro de dicho plazo:</p>
                  <ul>
                    <li>EL PRESTADOR podrá cerrar administrativamente el expediente.</li>
                    <li>El servicio podrá darse por concluido respecto del alcance contratado.</li>
                    <li>Cualquier reactivación, actualización o continuación del análisis podrá generar costos adicionales o requerir una nueva contratación.</li>
                  </ul>
                </div>
              </div>

              <div className="sect reveal" id="s6">
                <div className="sect-num">Cláusula 06</div>
                <h2 className="sect-title">Carácter preliminar <span className="it">de las recomendaciones.</span></h2>
                <div className="sect-body">
                  <p className="lead-in">Las observaciones y recomendaciones emitidas:</p>
                  <ul>
                    <li>Son preliminares.</li>
                    <li>Pueden modificarse conforme avance el análisis.</li>
                    <li>Dependen de validaciones técnicas posteriores.</li>
                    <li>Están sujetas a razón de negocios, materialidad y cumplimiento normativo aplicable.</li>
                  </ul>
                  <p>La implementación de cualquier estrategia deberá analizarse posteriormente de manera específica.</p>
                </div>
              </div>

              <div className="sect reveal" id="s7">
                <div className="sect-num">Cláusula 07</div>
                <h2 className="sect-title">Confidencialidad<span className="it">.</span></h2>
                <div className="sect-body">
                  <p>Toda información proporcionada por EL CLIENTE será tratada de manera <strong>confidencial</strong>.</p>
                  <p className="lead-in">EL PRESTADOR se compromete a:</p>
                  <ul>
                    <li>No divulgar información confidencial.</li>
                    <li>Utilizar la información únicamente para fines relacionados con el servicio.</li>
                    <li>Implementar medidas razonables de protección documental y digital.</li>
                  </ul>
                  <p>La obligación de confidencialidad permanecerá vigente incluso después de concluido el servicio.</p>
                </div>
              </div>

              <div className="sect reveal" id="s8">
                <div className="sect-num">Cláusula 08</div>
                <h2 className="sect-title">Propiedad <span className="it">intelectual.</span></h2>
                <div className="sect-body">
                  <p>Las metodologías, estructuras, criterios, materiales, presentaciones, análisis y estrategias presentadas durante el servicio son <strong>propiedad intelectual de EL PRESTADOR</strong>.</p>
                  <p className="lead-in">EL CLIENTE no podrá:</p>
                  <ul>
                    <li>Reproducirlas.</li>
                    <li>Comercializarlas.</li>
                    <li>Compartirlas con terceros.</li>
                    <li>Utilizarlas para fines distintos al servicio contratado.</li>
                  </ul>
                  <p>Sin autorización previa y por escrito.</p>
                </div>
              </div>

              <div className="sect reveal" id="s9">
                <div className="sect-num">Cláusula 09</div>
                <h2 className="sect-title">Honorarios y <span className="it">formas de pago.</span></h2>
                <div className="sect-body">
                  <p className="lead-in">Los honorarios:</p>
                  <ul>
                    <li>Deberán cubrirse de manera anticipada.</li>
                    <li>Incluyen únicamente el alcance contratado.</li>
                    <li>No incluyen servicios adicionales, impuestos o gastos extraordinarios salvo indicación expresa.</li>
                  </ul>
                  <p className="lead-in">En caso de falta de pago:</p>
                  <ul>
                    <li>EL PRESTADOR podrá suspender el servicio.</li>
                    <li>Reagendar sesiones.</li>
                    <li>Cancelar entregables pendientes.</li>
                  </ul>
                </div>
              </div>

              <div className="sect reveal" id="s9b">
                <div className="sect-num">Cláusula 09 · Bis</div>
                <h2 className="sect-title">Escalamiento <span className="it">de servicios.</span></h2>
                <div className="sect-body">
                  <p>En caso de que EL CLIENTE contrate inicialmente un servicio de revisión inicial, diagnóstico o sesión estratégica preliminar, podrá posteriormente escalar a un nivel superior de servicio dentro de la línea de Arquitectura Fiscal, Jurídica y Patrimonial.</p>
                  <p className="lead-in">Para dichos efectos:</p>
                  <ul>
                    <li>El monto efectivamente pagado por el servicio inicial podrá tomarse a cuenta del nuevo servicio contratado.</li>
                    <li>El beneficio únicamente será válido dentro de los 30 (treinta) días naturales posteriores a la fecha en que se haya llevado a cabo la sesión inicial.</li>
                    <li>Transcurrido dicho plazo, el beneficio perderá vigencia automáticamente y no será acumulable, transferible ni reembolsable.</li>
                  </ul>
                  <p className="lead-in">El escalamiento estará sujeto a:</p>
                  <ul>
                    <li>Disponibilidad operativa.</li>
                    <li>Validación interna del equipo estratégico.</li>
                    <li>Firma de documentación complementaria en caso de ser requerida.</li>
                  </ul>
                </div>
              </div>

              <div className="sect reveal" id="s10">
                <div className="sect-num">Cláusula 10</div>
                <h2 className="sect-title">Reprogramaciones <span className="it">y cancelaciones.</span></h2>
                <div className="sect-body">
                  <p>Las sesiones podrán reprogramarse con al menos <strong>24 horas de anticipación</strong>.</p>
                  <p className="lead-in">En caso de inasistencia sin previo aviso:</p>
                  <ul>
                    <li>La sesión podrá considerarse tomada.</li>
                    <li>La reprogramación quedará sujeta a disponibilidad.</li>
                  </ul>
                  <div className="callout">
                    <span className="lbl">— Nota</span>
                    <strong>No existen devoluciones una vez iniciada la prestación del servicio.</strong>
                  </div>
                </div>
              </div>

              <div className="sect reveal" id="s11">
                <div className="sect-num">Cláusula 11</div>
                <h2 className="sect-title">Tiempos de <span className="it">respuesta.</span></h2>
                <div className="sect-body">
                  <p className="lead-in">Los tiempos de respuesta compartidos:</p>
                  <ul>
                    <li>Son estimados.</li>
                    <li>Dependen de la complejidad del caso.</li>
                    <li>Pueden variar conforme al flujo operativo y disponibilidad del equipo.</li>
                  </ul>
                  <p>La falta de información por parte del cliente <strong>suspenderá automáticamente</strong> cualquier plazo estimado.</p>
                </div>
              </div>

              <div className="sect reveal" id="s12">
                <div className="sect-num">Cláusula 12</div>
                <h2 className="sect-title">No garantía <span className="it">de resultados.</span></h2>
                <div className="sect-body">
                  <p className="lead-in">EL PRESTADOR no garantiza:</p>
                  <ul>
                    <li>Ahorros fiscales específicos.</li>
                    <li>Aprobación de estructuras por autoridades.</li>
                    <li>Ausencia de revisiones fiscales.</li>
                    <li>Eliminación total de riesgos.</li>
                    <li>Resultados financieros determinados.</li>
                  </ul>
                  <p className="lead-in">Toda estrategia se encuentra sujeta a:</p>
                  <ul>
                    <li>Cumplimiento normativo.</li>
                    <li>Correcta implementación.</li>
                    <li>Materialidad.</li>
                    <li>Razón de negocios.</li>
                    <li>Cambios legislativos o criterios de autoridad.</li>
                  </ul>
                </div>
              </div>

              <div className="sect reveal" id="s13">
                <div className="sect-num">Cláusula 13</div>
                <h2 className="sect-title">Responsabilidad <span className="it">limitada.</span></h2>
                <div className="sect-body">
                  <p>La responsabilidad de EL PRESTADOR se limitará exclusivamente al <strong>monto efectivamente pagado</strong> por EL CLIENTE respecto del servicio contratado.</p>
                  <p className="lead-in">En ningún caso EL PRESTADOR será responsable por:</p>
                  <ul>
                    <li>Decisiones tomadas por el cliente.</li>
                    <li>Implementaciones realizadas sin acompañamiento técnico.</li>
                    <li>Omisiones del cliente.</li>
                    <li>Contingencias derivadas de ejercicios anteriores.</li>
                    <li>Cambios legislativos o criterios de autoridad.</li>
                  </ul>
                </div>
              </div>

              <div className="sect reveal" id="s14">
                <div className="sect-num">Cláusula 14</div>
                <h2 className="sect-title">Relación <span className="it">independiente.</span></h2>
                <div className="sect-body">
                  <p className="lead-in">La contratación del servicio:</p>
                  <ul>
                    <li>No crea relación laboral.</li>
                    <li>No constituye sociedad.</li>
                    <li>No genera representación legal.</li>
                    <li>No implica asociación entre las partes.</li>
                  </ul>
                </div>
              </div>

              <div className="sect reveal" id="s15">
                <div className="sect-num">Cláusula 15</div>
                <h2 className="sect-title">Medios <span className="it">electrónicos.</span></h2>
                <div className="sect-body">
                  <p className="lead-in">Las partes reconocen como válidas:</p>
                  <ul>
                    <li>Comunicaciones electrónicas.</li>
                    <li>Correos electrónicos.</li>
                    <li>Plataformas digitales.</li>
                    <li>Reuniones virtuales.</li>
                    <li>Firmas electrónicas autorizadas.</li>
                  </ul>
                </div>
              </div>

              <div className="sect reveal" id="s16">
                <div className="sect-num">Cláusula 16</div>
                <h2 className="sect-title">Jurisdicción<span className="it">.</span></h2>
                <div className="sect-body">
                  <p>Para cualquier controversia relacionada con los presentes términos y condiciones, las partes se someten a las leyes y tribunales competentes de <strong>Querétaro, Querétaro</strong>, renunciando a cualquier otro fuero que pudiera corresponderles.</p>
                </div>
              </div>

              <div className="sect reveal" id="s17">
                <div className="sect-num">Cláusula 17</div>
                <h2 className="sect-title">Aceptación<span className="it">.</span></h2>
                <div className="sect-body">
                  <p>La contratación, pago, confirmación de sesión o utilización de cualquiera de los servicios implicará la <strong>aceptación total</strong> de los presentes términos y condiciones.</p>
                </div>

                <div className="acepta">
                  <div className="lbl">— Documento vigente</div>
                  <p>
                    Al contratar cualquier servicio de Arquitectura Fiscal, Jurídica y Patrimonial con{' '}
                    <strong>Díaz Lara</strong>, EL CLIENTE reconoce haber leído, entendido y aceptado la
                    totalidad de las cláusulas aquí descritas.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-foot">
        <div className="container">
          <div className="foot-mega">Estructurar<span className="it">.</span></div>
          <div className="foot-cols">
            <div className="foot-col">
              <strong>— Díaz Lara · Arquitectura fiscal</strong>
              <p>Servicios estratégicos, fiscales, jurídicos, corporativos y patrimoniales para empresarios y organizaciones. Documento legal vigente al momento de contratación.</p>
            </div>
            <div className="foot-col">
              <strong>— Programa</strong>
              <a href="/diego">Sobre nosotros</a>
              <a href="/cursos">Capacitaciones</a>
              <a href="/eventos">Eventos</a>
              <a href="/academia">Miembros</a>
            </div>
            <div className="foot-col">
              <strong>— Documentos</strong>
              <a href="/terminos">Términos y condiciones</a>
              <a href="/privacidad">Aviso de privacidad</a>
              <a href="/faq">Preguntas frecuentes</a>
            </div>
            <div className="foot-col">
              <strong>— Contacto</strong>
              <a href="mailto:servicios@diegodiaz.mx">servicios@diegodiaz.mx</a>
              <a href="tel:+525584001184">+52 55 8400 1184</a>
              <span style={{ display: 'block' }}>Querétaro, Querétaro</span>
              <span style={{ display: 'block' }}>CDMX</span>
            </div>
            <div className="foot-col">
              <strong>— Legal</strong>
              <span style={{ display: 'block' }}>© {new Date().getFullYear()} Díaz Lara</span>
              <span style={{ display: 'block' }}>Diego Díaz · Estratega fiscal</span>
            </div>
          </div>
          <div className="foot-bot">
            <span>diegodiaz.mx · Sistema editorial</span>
            <span>Baskerville + Helvetica · México</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
