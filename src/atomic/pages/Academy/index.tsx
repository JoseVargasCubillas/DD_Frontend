import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useCartStore } from '@store/cartStore';

const courses = [
  'Como saber si pago mucho o lo justo en impuestos? 2026',
  'Equipo de alto impacto',
  'Deducciones modernas',
  'Precios de transferencia',
  'Derechos de autor',
];

const instructors = [
  ['Diego Diaz', 'Estrategia fiscal para empresarios con vision patrimonial.'],
  ['Janneth Belen', 'Impuestos, defensa y cumplimiento aplicado a negocios.'],
  ['Jessica Tapia', 'Ventas, comunicacion y posicionamiento profesional.'],
  ['Oscar Ancer', 'Operacion, liderazgo y crecimiento empresarial.'],
];

const included = [
  '+35 horas de contenido',
  'Cursos nuevos cada mes',
  'Sesiones mensuales',
  'Descargables exclusivos',
  'Acceso 24/7',
];

const academyPlans = {
  entrepreneur: {
    refId: 'off_academia_entrepreneur',
    title: 'Academia Entrepreneur',
    price: 4997,
  },
  plus: {
    refId: 'off_academia_plus',
    title: 'Academia +',
    price: 14997,
  },
  master: {
    refId: 'off_academia_master',
    title: 'Academia Master',
    price: 49997,
  },
};

const faqs = [
  ['Como funciona la academia?', 'Accedes con tu cuenta, eliges una ruta y consumes las clases a tu ritmo desde cualquier dispositivo.'],
  ['Los cursos se actualizan?', 'Si. El catalogo se actualiza con nuevas clases, masterclasses y sesiones especiales.'],
  ['Hay certificacion?', 'Algunos programas incluyen constancia digital cuando completas la ruta correspondiente.'],
  ['Como se accede a las masterclass?', 'Las masterclass aparecen dentro de tu cuenta si tu plan o compra incluye ese acceso.'],
  ['Emitien factura?', 'Si. Puedes solicitar factura fiscal con los datos de tu compra.'],
];

export default function Academy() {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const startAcademyCheckout = (plan = academyPlans.plus) => {
    addItem({
      id: `subscription-${plan.refId}`,
      type: 'offer',
      refId: plan.refId,
      title: plan.title,
      price: plan.price,
      quantity: 1,
      paymentType: 'subscription',
    });
    navigate('/checkout');
  };

  return (
    <div className="bg-[#f5f1e9] text-[#15120f]">
      <main className="mx-auto w-full max-w-[1280px] px-6 pt-8 md:px-10 xl:px-12">
        <TopRule />

        <section className="grid min-h-[560px] items-center gap-14 border-t border-[#d8d0c3] pt-16 md:grid-cols-[minmax(0,1fr)_420px] lg:gap-20 md:pt-20">
          <div className="max-w-[610px]">
            <p className="mb-8 text-[9px] uppercase tracking-[0.32em] text-[#9a9184]">La academia Diego Diaz</p>
            <h1 className="font-serif text-[52px] font-normal leading-[0.92] tracking-[-0.055em] text-[#191613] md:text-[72px]">
              La Academia
              <span className="block">donde</span>
              <em className="block font-serif italic">aprendes a ser</em>
              empresario.
            </h1>
            <p className="mt-7 max-w-[460px] text-[13px] leading-[1.65] text-[#6f665d]">
              Mas de 100 horas en cursos especializados en estrategia fiscal moderna, sistemas empresariales y liderazgo para crecer con criterio.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" onClick={() => startAcademyCheckout()} className="academy-dark-button">
                Empieza hoy
              </button>
              <a href="#planes" className="academy-light-button">
                Ver contenido
              </a>
            </div>
          </div>

          <div className="relative aspect-[0.72] min-h-[380px] bg-[#1d1d1d] text-white shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#242424,#111)]" />
            <button
              type="button"
              aria-label="Reproducir video de academia"
              className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 text-white/70"
            >
              <span className="ml-0.5 block h-0 w-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-current" />
            </button>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[8px] uppercase tracking-[0.22em] text-white/35">
              <span>01:36</span>
              <span>HD</span>
            </div>
          </div>
        </section>

        <SplitHeading eyebrow="01 / Perfil" title="Disenada para" italic="dos perfiles." />
        <section className="grid border border-[#ded6ca] bg-[#f8f5ef] md:grid-cols-2">
          <ProfilePanel title="Para empresarios" tags={['Fiscal', 'Crecimiento', 'Operacion', 'Patrimonio']}>
            Directores y socios de PyME que necesitan comprar paz patrimonial, mejores decisiones fiscales e inteligencia de negocio.
          </ProfilePanel>
          <ProfilePanel title="Para el se va a capacitar" tags={['Contable', 'Legal', 'Cultura', 'Venta']}>
            Profesionistas fiscales y despachos que quieren especializarse en estrategia de alto nivel junto a ejemplos y casos claros.
          </ProfilePanel>
        </section>

        <section className="mt-24 bg-[#eee9df] px-8 py-12 md:px-12 md:py-16">
          <SplitHeading eyebrow="02 / Membresia" title="Que incluye" italic="tu membresia." compact />
          <div className="mt-10 grid border border-[#dfd7ca] bg-[#f8f5ef] md:grid-cols-5">
            {included.map((item) => (
              <div key={item} className="flex min-h-[96px] items-center justify-center border-b border-[#dfd7ca] px-5 text-center font-serif text-[13px] leading-tight last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
                {item}
              </div>
            ))}
          </div>
        </section>

        <SplitHeading eyebrow="03 / Cursos" title="Cursos" italic="destacados." />
        <section className="grid border border-[#d8d0c3] bg-[#f8f5ef] md:grid-cols-3">
          <article className="relative min-h-[240px] border-b border-[#d8d0c3] p-5 md:col-span-1 md:border-b-0 md:border-r">
            <h3 className="font-serif text-[26px] uppercase leading-[1.02] tracking-[-0.04em]">
              Como saber si pago mucho o lo justo en impuestos? 2026
            </h3>
            <CircleMark />
          </article>
          <div className="grid md:col-span-2 md:grid-cols-2">
            {courses.slice(1).map((course) => (
              <article key={course} className="relative min-h-[120px] border-b border-[#d8d0c3] p-5 odd:md:border-r">
                <h3 className="font-serif text-[15px] leading-snug">{course}</h3>
                <CircleMark small />
              </article>
            ))}
          </div>
        </section>
        <CenteredButton>Ver cursos completos</CenteredButton>

        <section className="mt-24 bg-[#eee9df] px-8 py-12 md:px-12 md:py-16">
          <SplitHeading eyebrow="04 / Equipo" title="Quien" italic="imparte." compact />
          <div className="mt-10 grid gap-2 md:grid-cols-4">
            {instructors.map(([name, bio]) => (
              <article key={name} className="bg-[#f8f5ef]">
                <div className="flex aspect-[1.04] items-center justify-center bg-[#e5ded2] text-[9px] uppercase tracking-[0.24em] text-[#b4aa9d]">
                  Foto / mentor
                </div>
                <div className="border border-t-0 border-[#ded6ca] p-4">
                  <h3 className="font-serif text-[14px]">{name}</h3>
                  <p className="mt-2 text-[10px] leading-relaxed text-[#777064]">{bio}</p>
                </div>
              </article>
            ))}
          </div>
          <CenteredButton dark={false}>Ver todos los expertos</CenteredButton>
        </section>

        <section id="planes" className="mt-20 bg-[#050505] px-7 py-14 text-[#f3eee5] md:px-12 lg:px-16 md:py-20">
          <SplitHeading eyebrow="05 / Planes" title="Tres planes." italic="Una academia." compact inverted />
          <div className="mt-12 grid items-center gap-0 border border-white/15 md:grid-cols-3">
            <PlanCard name="Entrepreneur" price="4,997" features={['Cursos esenciales', 'Sesiones seleccionadas', 'Acceso mensual']} onClick={() => startAcademyCheckout(academyPlans.entrepreneur)} />
            <PlanCard name="Academia +" price="14,997" highlighted features={['Todo Entrepreneur', 'Masterclass mensuales', 'Material descargable premium']} onClick={() => startAcademyCheckout(academyPlans.plus)} />
            <PlanCard name="Master" price="49,997" features={['Acompanamiento avanzado', 'Acceso prioritario', 'Sesiones privadas B2B']} onClick={() => startAcademyCheckout(academyPlans.master)} />
          </div>
        </section>

        <section className="grid gap-12 py-24 md:grid-cols-[minmax(0,1fr)_360px] lg:gap-20 md:items-center">
          <div>
            <SplitHeading eyebrow="06 / Empresas" title="Academia para tu" italic="Equipo." compact />
            <h3 className="mt-10 max-w-[480px] font-serif text-[34px] leading-[1.02] tracking-[-0.04em]">
              Capacita a tu equipo de un <em className="italic">solo golpe.</em>
            </h3>
            <p className="mt-5 max-w-[560px] text-[13px] leading-[1.7] text-[#71685e]">
              Si lideras un equipo, el plan B2B permite entrenar a personas clave con una misma ruta, seguimiento y sesiones cerradas.
            </p>
            <div className="mt-8 grid max-w-[680px] border border-[#d8d0c3] md:grid-cols-2">
              {['Accesos para equipo', 'Reportes de avance', 'Capacitacion aplicable', 'Onboarding dedicado'].map((item, index) => (
                <div key={item} className="border-b border-[#d8d0c3] p-5 md:border-r md:even:border-r-0">
                  <span className="font-serif text-[22px] text-[#a79d91]">{String(index + 1).padStart(2, '0')}</span>
                  <p className="mt-2 text-[11px] leading-snug">{item}</p>
                </div>
              ))}
            </div>
            <button type="button" className="academy-dark-button mt-7">Solicitar plan</button>
          </div>
          <aside className="border border-[#bfb6aa] bg-[#f8f5ef] p-8">
            <p className="font-serif text-[42px] italic leading-none text-[#8f7d68]">~B2B</p>
            <h3 className="mt-6 font-serif text-[22px] leading-tight">Academia for Teams</h3>
            <p className="mt-4 text-[12px] leading-relaxed text-[#6f665d]">
              Para organizaciones que necesitan desarrollar criterio fiscal, comercial y operativo.
            </p>
            <button type="button" className="academy-light-button mt-8 w-full">Agendar llamada</button>
          </aside>
        </section>

        <section className="bg-[#eee9df] px-8 py-20 text-center md:px-16">
          <p className="mb-10 text-[9px] uppercase tracking-[0.32em] text-[#afa598]">07 / Caso real</p>
          <blockquote className="mx-auto max-w-[760px] font-serif text-[33px] leading-[1.14] tracking-[-0.045em] md:text-[43px]">
            "La Academia ha sido la <em className="italic">mejor inversion</em> que hemos hecho con mi equipo de socios. Estrategias practicas, no <em className="italic">teoria</em>."
          </blockquote>
          <p className="mt-10 text-[10px] uppercase tracking-[0.22em] text-[#756d63]">Lic. Cristian Granada Gomez</p>
        </section>

        <SplitHeading eyebrow="08 / Preguntas" title="Preguntas" italic="frecuentes." />
        <section className="divide-y divide-[#ded6ca] border-y border-[#ded6ca]">
          {faqs.map(([question, answer], index) => (
            <details key={question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                <span className="grid grid-cols-[48px_1fr] items-baseline gap-4">
                  <span className="text-[10px] text-[#aaa195]">{String(index + 1).padStart(2, '0')}</span>
                  <span className="font-serif text-[15px]">{question}</span>
                </span>
                <span className="text-[16px] text-[#8d8378] group-open:rotate-45">+</span>
              </summary>
              <p className="ml-[64px] mt-3 max-w-[620px] text-[12px] leading-relaxed text-[#746b62]">{answer}</p>
            </details>
          ))}
        </section>

        <section className="relative left-1/2 mt-20 w-screen -translate-x-1/2 bg-[#050505] px-6 py-24 text-center text-[#f3eee5] md:px-12">
          <div className="mx-auto max-w-[1280px]">
            <p className="text-[9px] uppercase tracking-[0.34em] text-white/35">09 / El exito</p>
            <h2 className="mx-auto mt-6 max-w-[760px] font-serif text-[44px] font-normal leading-[1] tracking-[-0.055em] md:text-[66px]">
              El exito ama la preparacion.
            </h2>
            <p className="mt-5 text-[13px] text-white/55">Tu mejor forma de crecer es una estrategia diaria de preparacion.</p>
            <button type="button" onClick={() => startAcademyCheckout()} className="mt-9 bg-[#f6f1e8] px-7 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#090909]">
              Entrar a Academia
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

function TopRule() {
  return (
    <div className="mb-10 flex items-center justify-between border-y border-[#d8d0c3] py-4 text-[8px] uppercase tracking-[0.3em] text-[#aaa195]">
      <span>Streaming</span>
      <span>Mentoria</span>
      <span>Fiscalidad</span>
    </div>
  );
}

function SplitHeading({
  eyebrow,
  title,
  italic,
  compact,
  inverted,
}: {
  eyebrow: string;
  title: string;
  italic: string;
  compact?: boolean;
  inverted?: boolean;
}) {
  return (
    <header className={`${compact ? 'mt-0' : 'mt-24'} border-b ${inverted ? 'border-white/12' : 'border-[#ded6ca]'} pb-8`}>
      <div className="grid gap-5 md:grid-cols-[88px_1fr_auto] md:items-start">
        <p className={`text-[8px] uppercase tracking-[0.28em] ${inverted ? 'text-white/30' : 'text-[#afa598]'}`}>{eyebrow}</p>
        <h2 className={`font-serif text-[35px] font-normal leading-[0.98] tracking-[-0.055em] md:text-[46px] ${inverted ? 'text-[#f6f1e8]' : 'text-[#15120f]'}`}>
          {title}
          <span className="block"><em className="italic">{italic}</em></span>
        </h2>
        <p className={`hidden text-[8px] uppercase tracking-[0.24em] md:block ${inverted ? 'text-white/25' : 'text-[#b1a79b]'}`}>Pag / 01</p>
      </div>
    </header>
  );
}

function ProfilePanel({ title, children, tags }: { title: string; children: ReactNode; tags: string[] }) {
  return (
    <article className="min-h-[170px] border-b border-[#ded6ca] p-7 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <h3 className="font-serif text-[19px] italic">{title}</h3>
      <p className="mt-4 max-w-[330px] text-[12px] leading-relaxed text-[#71685e]">{children}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="border border-[#d8d0c3] px-2 py-1 text-[8px] uppercase tracking-[0.16em] text-[#7d7368]">{tag}</span>
        ))}
      </div>
    </article>
  );
}

function CircleMark({ small }: { small?: boolean }) {
  return (
    <span className={`absolute bottom-4 right-4 flex ${small ? 'h-5 w-5' : 'h-6 w-6'} items-center justify-center rounded-full border border-[#bdb4aa] text-[10px] text-[#8d8378]`}>
      +
    </span>
  );
}

function CenteredButton({ children }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className="mt-6 flex justify-center">
      <button type="button" className="academy-light-button">
        {children}
      </button>
    </div>
  );
}

function PlanCard({
  name,
  price,
  features,
  highlighted,
  onClick,
}: {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
  onClick?: () => void;
}) {
  return (
    <article className={`${highlighted ? 'relative -my-8 bg-[#f6f1e8] text-[#15120f] shadow-[0_30px_80px_rgba(0,0,0,0.45)]' : 'text-[#f3eee5]'} min-h-[430px] border-b border-white/15 p-8 md:border-b-0 md:border-r md:last:border-r-0`}>
      {highlighted && <p className="absolute left-0 right-0 top-0 bg-[#a98e66] py-2 text-center text-[8px] uppercase tracking-[0.24em] text-white">Mas elegido</p>}
      <h3 className="mt-8 font-serif text-[24px] italic">{name}</h3>
      <p className="mt-5 font-serif text-[46px] leading-none tracking-[-0.06em]">
        <span className="text-[20px]">$</span>{price}
      </p>
      <p className={`mt-2 text-[9px] uppercase tracking-[0.2em] ${highlighted ? 'text-[#7c7166]' : 'text-white/35'}`}>MXN / mes</p>
      <ul className="mt-8 space-y-4">
        {features.map((feature) => (
          <li key={feature} className={`border-t pt-3 text-[11px] ${highlighted ? 'border-[#d8d0c3] text-[#544c44]' : 'border-white/10 text-white/55'}`}>{feature}</li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onClick}
        className={`mt-10 min-h-11 w-full border px-5 text-[9px] font-semibold uppercase tracking-[0.18em] ${highlighted ? 'border-[#15120f] bg-[#15120f] text-white' : 'border-white/30 text-white'}`}
      >
        Aplicar ahora
      </button>
    </article>
  );
}
