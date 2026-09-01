import { useState } from 'react';
import diegoAjedrez from '../../../../assets/ddweb/diego-ajedrez.jpg';
import { waLink, WHATSAPP_DEFAULT_MESSAGE } from '@utils/whatsapp';

const mono = 'font-mono text-[13px] uppercase tracking-[0.14em] text-ink-900/55';
const border = 'border-ink-900/10';

const intentions = [
  ['01', 'Asistir a un evento', 'Reservar cupo, dudas de logística, traer un equipo, recibir agenda completa.', '/ eventos'],
  ['02', 'Academia & cursos', 'Programas en línea, formación a equipo y certificaciones internas.', '/ academia'],
  ['03', 'Consultoría Díaz Lara', 'Reestructura fiscal, holdings, defensa SAT, planeación patrimonial.', 'diaz-lara.mx ↗'],
  ['04', 'Prensa & medios', 'Entrevistas, columnas de opinión, conferencias keynote.', 'prensa@'],
  ['05', 'Otro asunto', 'Colaboraciones, propuestas, podcast, alianzas o mentorías.', 'hola@'],
];

const responseTimes = [
  ['Eventos & consultoría', '< 12 horas'],
  ['Academia', '< 24 horas'],
  ['Prensa', '< 48 horas'],
  ['Otro', '3-5 días hábiles'],
];

const channels: Array<[string, string, string, string, string, string?]> = [
  ['— Canal 01 · Más rápido', 'WhatsApp', 'Para asuntos urgentes, cierres de cupo, dudas concretas. Te responde Diego o su jefa de gabinete.', '+52 1 442 114 3667', 'Abrir conversación →', waLink(WHATSAPP_DEFAULT_MESSAGE)],
  ['— Canal 02', 'Por correo', 'Para asuntos formales, propuestas, prensa, documentación adjunta o cuando el detalle importa.', 'hola@diegodiaz.mx', 'Redactar correo →', 'mailto:hola@diegodiaz.mx'],
  ['— Canal 03', 'Llamada agendada', '30 minutos con la jefa de gabinete para mapear si Diego es la persona correcta para ayudarte.', 'Agenda privada', 'Agendar llamada →', '/contacto#formulario'],
];

const pressResources = [
  ['Dossier biográfico (PDF)', 'PDF · 2.4 MB ↓'],
  ['Fotografías en alta resolución', 'ZIP · 18 fotos ↓'],
  ['Agenda pública 2026', 'Ver →'],
  ['Solicitud de entrevista', 'Prensa@ →'],
  ['Solicitud de ponencia / keynote', 'Formulario →'],
];

const socialLinks = [
  ['Red 01', '@diegodiazmr', 'LinkedIn · 84.2K seguidores', 'Seguir →'],
  ['Red 02', '@diego.diaz.mx', 'Instagram · 32.5K seguidores', 'Seguir →'],
  ['Red 03', '@DDiazFiscal', 'X / Twitter · 18.9K seguidores', 'Seguir →'],
  ['Red 04', 'El Estratega', 'YouTube · 12.4K suscriptores', 'Suscribirme →'],
];

export default function Contact() {
  const [intent, setIntent] = useState('Academia');

  return (
    <div className="bg-cream-50 text-ink-900">
      <section id="contacto" className="container-app grid min-h-[470px] scroll-mt-24 gap-10 py-16 md:py-20 lg:grid-cols-[120px_1fr] lg:items-start lg:py-[72px]">
        <p className={`${mono} pt-2`}>— 00</p>
        <div className="max-w-[900px]">
          <h1 className="font-serif text-[clamp(58px,9.4vw,100px)] font-normal leading-[0.96] tracking-normal">
            <span className="block">Hablemos.</span>
            <em className="block font-normal">Una conversación,</em>
            <em className="block font-normal">una decisión.</em>
          </h1>
          <div className="mt-7 grid items-end gap-8 lg:grid-cols-[minmax(340px,420px)_1fr]">
            <p className="max-w-[420px] font-serif text-[16px] italic leading-[1.55] text-ink-900/60">
              Cada mensaje que entra por aquí lo lee Diego antes que cualquier asistente. Sé claro sobre tu intención y te respondemos rápido — sin formularios infinitos.
            </p>
            <div className="grid max-w-[330px] grid-cols-3 gap-8 lg:translate-y-1">
              {[
                ['< 24h', 'SLA promedio'],
                ['100%', 'Lee Diego'],
                ['5', 'Canales'],
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="font-serif text-[27px] leading-none">{value}</p>
                  <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-900/45">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-app py-16 lg:py-20">
        <div className={`grid items-end gap-7 border-b ${border} pb-7 md:grid-cols-[90px_1fr_auto]`}>
          <span className={mono}>— 01</span>
          <h2 className="font-serif text-[clamp(44px,5vw,58px)] font-normal leading-none tracking-[-0.04em]">
            <em className="font-normal">¿Por qué</em> me escribes?
          </h2>
          <span className={`${mono} hidden md:block`}>5 intenciones · elige 1</span>
        </div>
        <div className={`mt-14 grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-5`}>
          {intentions.map(([n, title, body, route]) => (
            <button
              key={title}
              type="button"
              onClick={() => setIntent(title)}
              className={`group flex aspect-square w-full min-w-0 cursor-pointer flex-col border ${border} bg-cream-50 p-5 text-left text-ink-900 transition-colors duration-300 hover:border-ink-900 hover:bg-ink-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/35`}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-900/45 transition-colors duration-300 group-hover:text-white/55">
                  — Intención {n}
                </span>
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-ink-900/10 text-[13px] leading-none text-ink-900/45 transition-colors duration-300 group-hover:border-white/35 group-hover:bg-white group-hover:text-ink-900">
                  +
                </span>
              </div>
              <h3 className="mt-6 max-w-[185px] font-serif text-[clamp(23px,1.9vw,27px)] leading-[1.02] tracking-[-0.04em]">
                {title.includes(' & ') ? (
                  <>
                    {title.split(' & ')[0]} <span className="font-serif italic">&</span><br />{title.split(' & ')[1]}
                  </>
                ) : title.includes('Díaz Lara') ? (
                  <>
                    Consultoría Díaz<br />Lara
                  </>
                ) : title}
              </h3>
              <p className="mt-4 text-[13px] leading-[1.45] text-ink-900/62 transition-colors duration-300 group-hover:text-white/68">{body}</p>
              <p className="mt-auto border-t border-ink-900/10 pt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-900/45 transition-colors duration-300 group-hover:border-white/15 group-hover:text-white/60">
                → {route}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section className="container-app grid items-start gap-16 py-20 lg:grid-cols-[0.95fr_0.9fr] lg:py-24">
        <div className="max-w-[560px]">
          <p className={mono}>— 02</p>
          <h2 className="mt-3 font-serif text-[clamp(54px,6vw,72px)] font-normal leading-[0.96] tracking-[-0.04em]">
            El <em className="font-normal">formulario</em><br />que sí leo.
          </h2>
          <p className="mt-8 max-w-[480px] font-serif text-[17px] italic leading-[1.55] text-ink-900/60">
            Una sola forma. Cinco preguntas. La intención que elegiste arriba afina las respuestas que recibirás.
          </p>
          <div className={`mt-10 border-l-2 border-ink-900 bg-cream-100 px-6 py-7`}>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-900/50">— Contexto seleccionado</p>
            <p className="mt-4 font-serif text-[17px] italic leading-relaxed">
              Estás escribiendo sobre {intent}. El formulario te pedirá tamaño de equipo y nivel.
            </p>
          </div>
          <div className="mt-9 max-w-[560px]">
            {responseTimes.map(([label, time]) => (
              <div key={label} className={`flex items-center justify-between border-b ${border} py-5`}>
                <span className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-900">
                  <span className="h-2 w-2 rounded-full bg-ink-900" />
                  {label}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-900/50">{time}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:pt-0">
          <img
            src={diegoAjedrez}
            alt="Diego Díaz revisando una estrategia"
            className="ml-auto aspect-[0.73] w-full max-w-[560px] object-cover"
          />
        </div>
      </section>

      <section className="container-app py-20 lg:py-24">
        <div className={`grid items-end gap-7 border-b ${border} pb-7 md:grid-cols-[90px_1fr_auto]`}>
          <span className={mono}>— 03</span>
          <h2 className="font-serif text-[clamp(42px,5vw,58px)] font-normal leading-none tracking-[-0.04em]">
            <em className="font-normal">Si prefieres</em> escribir directo.
          </h2>
          <span className={`${mono} hidden md:block`}>3 canales · sin formulario</span>
        </div>
        <div className={`mt-14 grid items-stretch gap-5 lg:grid-cols-3`}>
          {channels.map(([eyebrow, title, body, value, cta, href]) => {
            const isExternal = href?.startsWith('http') || href?.startsWith('mailto:');
            const Wrapper: 'a' | 'article' = href ? 'a' : 'article';
            const wrapperProps: any = href
              ? {
                  href,
                  ...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {}),
                }
              : {};
            return (
              <Wrapper
                key={title}
                {...wrapperProps}
                className={`group flex min-h-[312px] cursor-pointer flex-col border ${border} bg-cream-50 p-8 text-ink-900 no-underline transition-colors duration-300 hover:border-ink-900 hover:bg-ink-900 hover:text-white`}
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-900/45 transition-colors duration-300 group-hover:text-white/55">{eyebrow}</p>
                <h3 className="mt-6 font-serif text-[clamp(31px,3vw,38px)] leading-[1.02] tracking-[-0.045em]">
                  {title.includes('WhatsApp') ? (
                    <>
                      <em className="font-normal">WhatsApp</em> directo
                    </>
                  ) : title.includes('Llamada') ? (
                    <>
                      Llamada <em className="font-normal">agendada</em>
                    </>
                  ) : title.includes('correo') ? (
                    <>
                      Por <em className="font-normal">correo</em>
                    </>
                  ) : title}
                </h3>
                <p className="mt-5 max-w-[300px] text-[13px] leading-[1.6] text-ink-900/62 transition-colors duration-300 group-hover:text-white/65">{body}</p>
                <p className="mt-5 font-mono text-[13px] tracking-[0.18em] text-ink-900 transition-colors duration-300 group-hover:text-white">{value}</p>
                <p className="mt-auto border-t border-ink-900/10 pt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-900 transition-colors duration-300 group-hover:border-white/15 group-hover:text-white">
                  {cta}
                </p>
              </Wrapper>
            );
          })}
        </div>
      </section>

      <section className="container-app grid gap-14 border-t border-ink-900/10 py-20 lg:grid-cols-[0.92fr_0.95fr] lg:py-24">
        <div className="max-w-[560px]">
          <p className={mono}>— 04</p>
          <h2 className="mt-4 font-serif text-[clamp(44px,5vw,58px)] font-normal leading-none tracking-[-0.04em]">
            <em className="font-normal">La oficina</em> en México.
          </h2>

          <div className="mt-8 border-b border-ink-900/10 pb-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-900/50">Dirección</p>
            <p className="mt-4 max-w-[430px] font-serif text-[18px] leading-[1.45]">
              <em className="font-normal">Av Colinas del Cimatario 435-98,</em><br />
              Colinas del Cimatario,<br />
              76090 Santiago de Querétaro, Qro.
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-900/55">
              Recepción Díaz Lara · Lun a Vie · 9:00 - 18:00
            </p>
          </div>

          <div className="border-b border-ink-900/10 py-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-900/50">Visitas</p>
            <p className="mt-4 max-w-[480px] font-serif text-[18px] leading-[1.45]">
              Las reuniones presenciales son <em className="font-normal">previamente agendadas.</em> No recibimos sin cita por respeto a tu tiempo y al nuestro.
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-900/55">
              Agenda vía contacto o WhatsApp
            </p>
          </div>

          <div className="border-b border-ink-900/10 py-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-900/50">Datos fiscales</p>
            <p className="mt-4 font-serif text-[18px] leading-[1.45]">Díaz Lara y Asociados, S.C.</p>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-900/55">
              RFC · DLA210315ABC · Cédula prof. 8112406
            </p>
          </div>

          <div className="pt-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-900/50">Horario de atención general</p>
            <p className="mt-4 font-serif text-[18px] leading-[1.45]">
              Lun - Vie: 09:00 - 19:00 hrs<br />
              Sáb: 10:00 - 13:00 (sólo urgencias)
            </p>
          </div>
        </div>

        <div className={`relative min-h-[520px] overflow-hidden border ${border} bg-cream-100 shadow-[0_20px_80px_rgba(10,10,10,0.08)]`}>
          <iframe
            title="Mapa de la oficina Díaz Lara en Querétaro"
            src="https://www.google.com/maps?q=Av%20Colinas%20del%20Cimatario%20435-98%2C%20Colinas%20del%20Cimatario%2C%2076090%20Santiago%20de%20Quer%C3%A9taro%2C%20Qro.&output=embed"
            className="h-full min-h-[520px] w-full grayscale"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute right-6 top-6 max-w-[250px] border border-ink-900 bg-cream-50 p-5 text-ink-900 shadow-sm">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-900/55">— Oficina Díaz Lara</p>
            <p className="mt-3 font-serif text-[19px] leading-tight">Colinas del Cimatario 435-98</p>
            <p className="mt-2 text-[12px] leading-relaxed text-ink-900/65">Santiago de Querétaro, Qro.</p>
          </div>
          <div className="absolute bottom-6 left-6 bg-ink-900 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-white">
            [ Mapa · Colinas del Cimatario · Querétaro ]
          </div>
        </div>
      </section>

      <section className="container-app grid gap-14 border-t border-ink-900/10 py-20 lg:grid-cols-[0.85fr_1fr] lg:py-24">
        <div className="max-w-[500px]">
          <p className={mono}>— 05</p>
          <h2 className="mt-4 font-serif text-[clamp(42px,5vw,58px)] font-normal leading-none tracking-[-0.04em]">
            Para <em className="font-normal">prensa</em> & medios.
          </h2>
          <p className="mt-8 max-w-[430px] font-serif text-[18px] italic leading-[1.55] text-ink-900/60">
            Material de apoyo, dossier biográfico, fotografías editoriales en alta resolución, agenda pública confirmada, y solicitudes de entrevista o ponencia.
          </p>
        </div>

        <div className={`border ${border}`}>
          {pressResources.map(([title, action]) => (
            <a
              key={title}
              href={action.toLowerCase().includes('prensa') ? 'mailto:prensa@diegodiaz.mx' : '#'}
              className={`group grid min-h-[70px] items-center gap-4 border-b ${border} px-7 py-5 transition-colors duration-300 last:border-b-0 hover:bg-ink-900 hover:text-white md:grid-cols-[1fr_auto]`}
            >
              <span className="font-serif text-[18px] italic leading-tight">{title}</span>
              <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-ink-900 transition-colors duration-300 group-hover:text-white">
                {action}
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="bg-ink-900 py-24 text-white">
        <div className="container-app text-center">
          <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-white/55">— Nota del autor</p>
          <blockquote className="mx-auto mt-8 max-w-[1080px] font-serif text-[clamp(42px,7vw,82px)] italic leading-[1.05] tracking-[-0.05em]">
            "Los mensajes que más recuerdo son los que llegan sin guión. Si tienes una pregunta incómoda — escríbela tal cual."
          </blockquote>
          <p className="mt-8 text-white/60">— Diego Díaz, 2026</p>
        </div>
      </section>

      <section className="border-t border-ink-900/10">
        <div className="container-app py-20 lg:py-24">
          <div className={`grid items-end gap-7 border-b ${border} pb-7 md:grid-cols-[90px_1fr_auto]`}>
            <span className={mono}>— 06</span>
            <h2 className="font-serif text-[clamp(40px,5vw,58px)] font-normal leading-none tracking-[-0.04em]">
              <em className="font-normal">Sígueme</em> en otras tribunas.
            </h2>
            <span className={`${mono} hidden md:block`}>4 redes activas</span>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {socialLinks.map(([network, handle, detail, cta]) => (
              <a
                key={handle}
                href="#"
                className={`group flex min-h-[170px] cursor-pointer flex-col border ${border} bg-cream-50 p-7 text-ink-900 transition-colors duration-300 hover:border-ink-900 hover:bg-ink-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/35`}
                aria-label={`${cta.replace(' →', '')} ${handle}`}
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-900/45 transition-colors duration-300 group-hover:text-white/55">
                  — {network}
                </p>
                <p className="mt-6 font-serif text-[clamp(25px,2.2vw,31px)] italic leading-none tracking-[-0.035em]">
                  {handle}
                </p>
                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-900 transition-colors duration-300 group-hover:text-white">
                  {detail}
                </p>
                <p className="mt-auto border-t border-ink-900/10 pt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-900/45 transition-colors duration-300 group-hover:border-white/15 group-hover:text-white/70">
                  {cta}
                </p>
              </a>
            ))}
          </div>
        </div>

        <div className={`container-app border-t ${border} pb-6 pt-14`}>
          <h2 className="font-serif text-[clamp(88px,13vw,170px)] font-normal leading-[0.78] tracking-[-0.055em]">
            Hablemos
          </h2>
        </div>
      </section>
    </div>
  );
}
