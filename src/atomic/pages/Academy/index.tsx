import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@store/cartStore';
import diegoPortrait from '../../../../assets/eventos/LEF_img_001.png';
import imarPortrait from '../../../../assets/eventos/LEF_img 002.png';
import jazminPortrait from '../../../../assets/eventos/LEF_img 003.png';
import jessicaPortrait from '../../../../assets/eventos/LEF_img_004.png';

const cream = 'bg-[#f5f2ec]';
const pearl = 'bg-[#efebe2]';
const line = 'border-[#0a0a0a]/10';
const mono = 'font-mono text-[10px] uppercase tracking-[0.18em] text-[#0a0a0a]/40';

const featuredCourses = [
  { title: 'Equipos de Alto Impacto', hours: '8 hrs' },
  { title: 'Deducciones Inteligentes', hours: '6 hrs' },
  { title: 'Precios de Transferencia', hours: '10 hrs' },
  { title: 'Derechos de Autor', hours: '5 hrs' },
];

const speakers = [
  {
    name: 'Jazmín Robles',
    role: 'Defensa fiscal',
    bio: 'Abogada Fiscalista, Maestra en Derecho Fiscal y Doctora en Ciencias de lo Fiscal.',
    image: jazminPortrait,
    position: 'object-[50%_16%]',
  },
  {
    name: 'Jessica Tapía',
    role: 'Defensa SAT',
    bio: 'Líder del área de consultoría y abogada fiscal-corporativa.',
    image: jessicaPortrait,
    position: 'object-[50%_14%]',
  },
  {
    name: 'Imar Amor',
    role: 'Finanzas',
    bio: 'Licenciada en Finanzas y Contaduría Pública. Proyectos de análisis corporativo con componente internacional.',
    image: imarPortrait,
    position: 'object-[50%_14%]',
  },
  {
    name: 'Diego Díaz',
    role: 'Estratega principal',
    bio: 'Fundador de Díaz Lara. Autor de 3 libros.',
    image: diegoPortrait,
    position: 'object-[50%_12%]',
  },
];

const speakerLoop = [...speakers, ...speakers];

const plans = [
  {
    id: 'off_academia_entrepreneur',
    name: 'Entrepreneur',
    eyebrow: 'Plan básico',
    price: '4,997',
    amount: 4997,
    plan: 'entrepreneur',
    suffix: '/ año',
    note: '7 días gratis · Cancela cuando quieras',
    items: ['Acceso ilimitado al catálogo', '+120 hrs de contenido'],
    dark: true,
    cta: 'Aplicar',
  },
  {
    id: 'off_academia_plus',
    name: 'Academia +',
    eyebrow: 'Más demandado',
    price: '14,997',
    amount: 14997,
    plan: 'plus',
    suffix: 'Anual',
    note: '',
    items: ['Todo lo anterior incluido', 'Mastermind mensual en vivo', 'Material descargable exclusivo'],
    featured: true,
    cta: 'Aplicar',
  },
  {
    id: 'off_academia_master',
    name: 'Master',
    eyebrow: 'Acceso total',
    price: '49,997',
    amount: 49997,
    plan: 'master',
    suffix: '/ Anual',
    note: 'Plazas limitadas',
    items: ['Todo lo anterior incluido', 'Grupo directo con Diego', 'Acceso a eventos VIP'],
    dark: true,
    cta: 'Aplicar a Master',
  },
];

const faqs = [
  {
    question: '¿Cómo funciona la academia?',
    answer:
      'Al contactar con un asesor comercial, te proporcionara tu acceso que llegara a tu correo. A tu mail llegaran tus datos de acceso los cuales podrás modificar con el primer inicio de sesion',
    open: true,
  },
  {
    question: '¿Los cursos se actualizan?',
    answer: 'Hay cursos nuevos cada mes, si no pudiste verlos en vivo podrás encontrarlos aquí.',
  },
  {
    question: '¿Hay certificación?',
    answer: 'Si, con tu asesor comercial podrás solicitar el certificado digital de cada curso.',
  },
  {
    question: '¿Cómo se accede a las masterminds?',
    answer:
      'Se te asignara un grupo de WhatsApp en el se estarán publicando cuando será el siguiente mastermind y las masterclass.',
  },
  {
    question: '¿Emiten factura?',
    answer: 'Si, pregunta a tu asesor comercial por tu factura al momento de realizar el pago.',
  },
];

function EditorialTitle({
  children,
  inverted = false,
  className = '',
}: {
  children: React.ReactNode;
  inverted?: boolean;
  className?: string;
}) {
  return (
    <h2
      className={`font-serif text-[clamp(54px,7vw,80px)] font-light leading-[0.95] tracking-[-0.045em] ${
        inverted ? 'text-[#f5f2ec]' : 'text-[#0a0a0a]'
      } ${className}`}
    >
      {children}
    </h2>
  );
}

function SectionIntro({
  index,
  label,
  side,
  children,
  inverted = false,
}: {
  index: string;
  label: string;
  side: string;
  children: React.ReactNode;
  inverted?: boolean;
}) {
  return (
    <div className={`grid gap-8 border-b pb-8 md:grid-cols-[100px_minmax(0,1fr)_220px] ${inverted ? 'border-white/15' : line}`}>
      <p className={`${mono} ${inverted ? 'text-white/50' : ''}`}>
        {index} /
        <span className="block normal-case tracking-[0.16em]">{label}</span>
      </p>
      <div>{children}</div>
      <p className={`${mono} text-left md:text-right ${inverted ? 'text-white/50' : ''}`}>{side}</p>
    </div>
  );
}

function ButtonLike({
  children,
  dark = false,
  onClick,
}: {
  children: React.ReactNode;
  dark?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-14 items-center gap-5 border px-7 text-[11px] uppercase tracking-[0.14em] transition ${
        dark
          ? 'border-[#0a0a0a] bg-[#0a0a0a] text-[#f5f2ec] hover:bg-[#1a1a1a]'
          : 'border-[#0a0a0a] bg-transparent text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-[#f5f2ec]'
      }`}
    >
      <span>{children}</span>
      <span>→</span>
    </button>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="border border-[#0a0a0a]/45 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#0a0a0a]">
      {children}
    </span>
  );
}

export default function Academy() {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const clearCart = useCartStore((state) => state.clear);

  const startAcademyCheckout = (plan = plans[1]) => {
    clearCart();
    addItem({
      id: `subscription-${plan.id}`,
      type: 'subscription',
      refId: plan.id,
      title: plan.name,
      price: plan.amount,
      quantity: 1,
    });
    navigate('/checkout');
  };

  const scrollToPricing = () => {
    document.getElementById('academy-pricing')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div className={`${cream} text-[#0a0a0a]`}>
      <section className="border-b border-[#0a0a0a]/10 px-5 pb-24 pt-16 md:px-10 lg:px-14 lg:pb-[101px] lg:pt-20">
        <div className={`mx-auto flex max-w-[1512px] justify-between border-b ${line} pb-8 ${mono}`}>
          <span>— Academia · Suscripción anual</span>
          <span>Contenido nuevo cada mes</span>
        </div>

        <div className="mx-auto grid max-w-[1512px] items-center gap-16 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,420px)] lg:gap-20">
          <div className="flex flex-col justify-center lg:min-h-[620px]">
            <h1 className="font-serif text-[clamp(76px,10vw,144px)] font-light leading-[0.88] tracking-[-0.045em]">
              La Academia
              <span className="block">donde</span>
              <em className="block font-normal italic">aprendes a ser</em>
              empresario.
            </h1>
            <p className="mt-8 max-w-[580px] text-[19px] leading-[1.5] text-[#0a0a0a]/65">
              Más de 120 horas de cursos especializados en estrategia fiscal mexicana, sesiones mastermind mensuales en vivo y contenido nuevo cada semana. Un solo pago con acceso anual
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLike dark onClick={() => startAcademyCheckout(plans[1])}>Comenzar</ButtonLike>
              <ButtonLike>Ver catálogo</ButtonLike>
            </div>
          </div>

          <div className="relative mx-auto flex aspect-[420/582] w-full max-w-[420px] items-center justify-center border border-[#0a0a0a]/20 bg-[linear-gradient(135deg,#1a1a1a,#2a2a2a)] shadow-[0_28px_70px_rgba(10,10,10,0.16)] lg:mx-0 lg:justify-self-end">
            <button
              type="button"
              aria-label="Reproducir tour"
              className="grid size-20 place-items-center rounded-full border border-[#f5f2ec] bg-white/10 text-[22px] text-[#f5f2ec]"
            >
              ▶
            </button>
            <div className="absolute bottom-5 left-6 right-6 flex justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-white/50">
              <span>— Tour 360°</span>
              <span>02:14</span>
            </div>
          </div>
        </div>
      </section>

      <section className={`${cream} border-b ${line} px-5 py-24 md:px-10 lg:px-14 lg:py-[140px]`}>
        <SectionIntro index="01" label="Audiencia" side="— Empresarios + Contadores">
          <EditorialTitle>
            Diseñada para
            <span className="block">dos <em className="font-normal italic">perfiles.</em></span>
          </EditorialTitle>
        </SectionIntro>

        <div className={`mt-20 grid border ${line} md:grid-cols-2`}>
          {[
            {
              title: 'Para empresarios',
              body: 'Dueños y socios de PyMEs y medianas empresas que quieren tomar decisiones fiscales informadas sin depender 100% de su contador. Estrategia, blindaje y planeación a largo plazo.',
              tags: ['PYMES', 'DIRECCIÓN', 'ESTRATEGIA', 'PATRIMONIO'],
            },
            {
              title: 'Para el se va a capacitar',
              body: 'Profesionales fiscales y despachos que quieren especializarse en estrategia y dar un servicio más completo a sus clientes. Track específico con material técnico avanzado.',
              tags: ['CONTADORES', 'DESPACHOS', 'CONSULTORÍA', 'DEFENSA'],
            },
          ].map((audience) => (
            <button
              key={audience.title}
              type="button"
              onClick={scrollToPricing}
              className={`group min-h-[380px] cursor-pointer border-b ${line} p-9 text-left transition-colors duration-300 hover:bg-[#0a0a0a] hover:text-[#f5f2ec] focus-visible:bg-[#0a0a0a] focus-visible:text-[#f5f2ec] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#6b4f2a] md:border-b-0 md:border-r md:last:border-r-0 lg:p-12`}
            >
              <h3 className="font-serif text-[44px] font-light leading-none tracking-[-0.025em]">
                {audience.title.includes('empresarios') ? (
                  <>Para <em className="font-normal italic">empresarios</em></>
                ) : (
                  audience.title
                )}
              </h3>
              <p className="mt-6 max-w-[560px] font-serif text-[19px] leading-[1.55] text-[#0a0a0a]/65 transition-colors group-hover:text-[#f5f2ec]/75 group-focus-visible:text-[#f5f2ec]/75">{audience.body}</p>
              <div className={`mt-8 flex flex-wrap gap-2 border-t ${line} pt-6 transition-colors group-hover:border-white/25 group-focus-visible:border-white/25`}>
                {audience.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-[#0a0a0a]/45 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#0a0a0a] transition-colors group-hover:border-[#f5f2ec]/45 group-hover:text-[#f5f2ec] group-focus-visible:border-[#f5f2ec]/45 group-focus-visible:text-[#f5f2ec]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className={`${pearl} border-b ${line} px-5 py-24 md:px-10 lg:px-14 lg:py-[140px]`}>
        <SectionIntro index="02" label="Beneficios" side="Acceso ilimitado · 24/7">
          <EditorialTitle>
            Qué incluye
            <span className="block">tu <em className="font-normal italic">membresía.</em></span>
          </EditorialTitle>
        </SectionIntro>

        <div className={`mt-20 grid border ${line} bg-[#f5f2ec] md:grid-cols-5`}>
          {['+120 horas de contenido', 'Cursos nuevos cada mes', 'Sesiones mastermind', 'Descargables exclusivos', 'Acceso 24/7'].map((benefit) => (
            <button
              key={benefit}
              type="button"
              onClick={scrollToPricing}
              className={`group grid min-h-[200px] cursor-pointer place-items-center border-b ${line} p-7 text-center font-serif text-[19px] leading-[1.2] transition-colors duration-300 hover:bg-[#0a0a0a] hover:text-[#f5f2ec] focus-visible:bg-[#0a0a0a] focus-visible:text-[#f5f2ec] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#6b4f2a] md:border-b-0 md:border-r md:last:border-r-0`}
            >
              <span>{benefit}</span>
            </button>
          ))}
        </div>
      </section>

      <section className={`${cream} border-b ${line} px-5 py-24 md:px-10 lg:px-14 lg:py-[140px]`}>
        <SectionIntro index="03" label="Catálogo" side="+40 cursos · 8 categorías">
          <EditorialTitle>
            Cursos
            <span className="block"><em className="font-normal italic">destacados.</em></span>
          </EditorialTitle>
        </SectionIntro>

        <div className={`mt-12 border ${line} bg-[#0a0a0a]/10 pt-8`}>
          <div className={`grid border-t ${line} bg-[#faf8f3] lg:grid-cols-4 lg:grid-rows-2`}>
            <button
              type="button"
              onClick={scrollToPricing}
              className={`group flex min-h-[420px] cursor-pointer flex-col border-b ${line} p-7 text-left transition-colors duration-300 hover:bg-[#0a0a0a] hover:text-[#f5f2ec] focus-visible:bg-[#0a0a0a] focus-visible:text-[#f5f2ec] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#6b4f2a] lg:col-span-2 lg:row-span-2 lg:min-h-[560px] lg:border-r`}
            >
              <h3 className="font-serif text-[clamp(32px,4vw,44px)] font-light uppercase leading-[1.1] tracking-[-0.015em]">
                ¿Cómo saber si pago mucho o lo justo en impuestos? 2026
              </h3>
              <div className={`mt-auto flex items-center justify-end border-t ${line} pt-5 transition-colors group-hover:border-white/25 group-focus-visible:border-white/25`}>
                <span className="grid size-8 place-items-center rounded-full border border-[#0a0a0a] transition-colors group-hover:border-[#f5f2ec] group-focus-visible:border-[#f5f2ec]">→</span>
              </div>
            </button>
            {featuredCourses.map((course) => (
              <button
                key={course.title}
                type="button"
                onClick={scrollToPricing}
                className={`group flex min-h-[280px] cursor-pointer flex-col border-b ${line} p-7 text-left transition-colors duration-300 hover:bg-[#0a0a0a] hover:text-[#f5f2ec] focus-visible:bg-[#0a0a0a] focus-visible:text-[#f5f2ec] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#6b4f2a] lg:border-r lg:[&:nth-child(3n)]:border-r-0`}
              >
                <p className={`${mono} transition-colors group-hover:text-[#f5f2ec]/55 group-focus-visible:text-[#f5f2ec]/55`}>— {course.hours}</p>
                <h3 className="mt-6 font-serif text-2xl font-light leading-[1.1] tracking-[-0.015em]">
                  {course.title.split(' ').slice(0, -1).join(' ')}{' '}
                  <em className="font-normal italic">{course.title.split(' ').slice(-1)}</em>
                </h3>
                <div className={`mt-auto flex items-center justify-end border-t ${line} pt-5 transition-colors group-hover:border-white/25 group-focus-visible:border-white/25`}>
                  <span className="grid size-8 place-items-center rounded-full border border-[#0a0a0a] transition-colors group-hover:border-[#f5f2ec] group-focus-visible:border-[#f5f2ec]">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-10 text-center">
          <ButtonLike onClick={scrollToPricing}>Ver catálogo completo</ButtonLike>
        </div>
      </section>

      <section className={`${pearl} border-b ${line} px-5 py-24 md:px-10 lg:px-14 lg:py-[140px]`}>
        <SectionIntro index="04" label="Ponentes" side="7 ponentes · expertos">
          <EditorialTitle>
            Quién
            <span className="block"><em className="font-normal italic">imparte.</em></span>
          </EditorialTitle>
        </SectionIntro>

        <div className="mt-12 overflow-hidden border-y border-[#0a0a0a]/10 py-6 [mask-image:linear-gradient(90deg,transparent,black_7%,black_93%,transparent)]">
          <div className="flex w-max gap-6 motion-safe:animate-[speaker-carousel_42s_linear_infinite] hover:[animation-play-state:paused]">
            {speakerLoop.map((speaker, index) => (
              <article
                key={`${speaker.name}-${index}`}
                className={`group w-[260px] shrink-0 border ${line} bg-[#f5f2ec] transition duration-300 hover:-translate-y-1 hover:bg-[#0a0a0a] hover:text-[#f5f2ec] md:w-[300px] lg:w-[326px]`}
              >
                <div className={`aspect-[1.04] overflow-hidden border-b ${line} bg-[linear-gradient(135deg,#e7e2d6,#efebe2)]`}>
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    loading="lazy"
                    className={`h-full w-full object-cover transition duration-700 group-hover:scale-[1.04] ${speaker.position}`}
                  />
                </div>
                <div className="p-5">
                  <p className={`${mono} transition-colors group-hover:text-[#f5f2ec]/55`}>— {speaker.role}</p>
                  <h3 className="mt-3 font-serif text-[22px] leading-tight">
                    {speaker.name === 'Diego Díaz' ? <>Diego <em className="italic">Díaz</em></> : speaker.name}
                  </h3>
                  <p className="mt-2 text-[12px] leading-[1.5] text-[#0a0a0a]/65 transition-colors group-hover:text-[#f5f2ec]/70">{speaker.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="mt-10 text-center">
          <ButtonLike>Ver todos los ponentes</ButtonLike>
        </div>
      </section>

      <section id="academy-pricing" className="scroll-mt-24 border-b border-white/15 bg-[#0a0a0a] px-5 py-24 text-[#f5f2ec] md:px-10 lg:px-14 lg:py-[140px]">
        <SectionIntro index="05" label="Inversión" side="— MXN + IVA" inverted>
          <EditorialTitle inverted>
            Tres planes.
            <span className="block">Una <em className="font-normal italic">academia.</em></span>
          </EditorialTitle>
        </SectionIntro>

        <div className="mt-20 grid border border-white/15 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative min-h-[680px] border-b border-white/15 p-10 lg:border-b-0 lg:border-r lg:last:border-r-0 ${
                plan.featured ? 'bg-[#f5f2ec] pt-24 text-[#0a0a0a]' : 'bg-[#0a0a0a] text-[#f5f2ec]'
              }`}
            >
              {plan.featured && (
                <div className="absolute inset-x-0 top-0 bg-[#6b4f2a] py-2 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-[#f5f2ec]">
                  Más demandado
                </div>
              )}
              <p className={`${mono} ${plan.featured ? '' : 'text-white/50'}`}>— {plan.eyebrow}</p>
              <h3 className="mt-3 font-serif text-[44px] font-light italic leading-none tracking-[-0.025em]">{plan.name}</h3>
              <div className="mt-5 flex items-baseline gap-2">
                <span className={plan.featured ? 'text-[#0a0a0a]/40' : 'text-white/50'}>$</span>
                <span className="font-serif text-[80px] font-light leading-none tracking-[-0.045em]">{plan.price}</span>
                <span className={`font-mono text-[11px] uppercase tracking-[0.12em] ${plan.featured ? 'text-[#0a0a0a]/65' : 'text-white/60'}`}>{plan.suffix}</span>
              </div>
              {plan.note && <p className={`${mono} mt-2 ${plan.featured ? '' : 'text-white/50'}`}>— {plan.note}</p>}
              <ul className="mt-8">
                {plan.items.map((item) => (
                  <li key={item} className={`border-b py-4 pl-7 text-sm ${plan.featured ? 'border-[#0a0a0a]/10 text-[#0a0a0a]/65' : 'border-white/12 text-white/85'}`}>
                    <span className="absolute -ml-7 opacity-60">→</span>{item}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => startAcademyCheckout(plan)}
                className={`absolute bottom-14 left-10 right-10 flex h-14 items-center justify-between border px-6 text-[11px] uppercase tracking-[0.14em] ${
                  plan.featured ? 'border-[#0a0a0a] bg-[#0a0a0a] text-[#f5f2ec]' : 'border-[#f5f2ec] text-[#f5f2ec]'
                }`}
              >
                <span>{plan.cta}</span>
                <span>→</span>
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className={`${cream} border-b ${line} px-5 py-24 md:px-10 lg:px-14 lg:py-[140px]`}>
        <SectionIntro index="06" label="Para empresas" side="— Plan B2B">
          <EditorialTitle>
            Academia
            <span className="block">para tu <em className="font-normal italic">Equipo.</em></span>
          </EditorialTitle>
        </SectionIntro>

        <div className="mt-20 grid gap-16 lg:grid-cols-[1.3fr_1fr] lg:gap-24">
          <div>
            <h3 className="font-serif text-[clamp(44px,6vw,64px)] font-light leading-[0.95] tracking-[-0.03em]">
              Capacita a tu equipo
              <span className="block">de un <em className="font-normal italic">solo golpe.</em></span>
            </h3>
            <p className="mt-8 max-w-[560px] font-serif text-[19px] leading-[1.6] text-[#0a0a0a]/65">
              Si lideras un equipo, el plan B2B te permite suscribir a todo tu equipo, acceder a reportes consolidados de avance, y compartir el mismo nivel técnico de capacitación que reciben los clientes de Diego.
            </p>
            <div className={`mt-8 grid border ${line} md:grid-cols-2`}>
              {['Acceso para todo el equipo', 'Reportes de avance', 'Capacitación certificada', 'Onboarding dedicado'].map((item, index) => (
                <div key={item} className={`min-h-[148px] border-b ${line} p-7 md:border-r md:[&:nth-child(even)]:border-r-0`}>
                  <p className="font-serif text-[40px] font-light tracking-[-0.04em] text-[#0a0a0a]/40">{String(index + 1).padStart(2, '0')}</p>
                  <p className="mt-2 font-serif text-[17px] leading-tight">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <ButtonLike dark>Habla con ventas</ButtonLike>
            </div>
          </div>

          <aside className="self-center border border-[#0a0a0a] bg-[#faf8f3] p-10 lg:p-12">
            <p className="font-serif text-[80px] font-light italic leading-none text-[#6b4f2a]">~B2B</p>
            <h3 className="mt-8 font-serif text-[28px] leading-[1.15]">Academia for<br /><em className="italic">Teams</em></h3>
            <p className="mt-5 text-sm leading-[1.6] text-[#0a0a0a]/65">
              Plan empresarial con licencias por usuario, descuentos por volumen y soporte dedicado. Ideal para equipos de +5 integrantes.
            </p>
            <p className={`${mono} mt-6`}>— Desde 5 usuarios · Cotización a medida</p>
            <div className="mt-4">
              <ButtonLike>Solicitar propuesta</ButtonLike>
            </div>
          </aside>
        </div>
      </section>

      <section className={`${pearl} border-b ${line} px-5 py-24 text-center md:px-10 lg:px-14 lg:py-[140px]`}>
        <div className="flex justify-between">
          <span className={mono}>07 / Voces</span>
          <span className={mono}>01 / 12 alumnos</span>
        </div>
        <blockquote className="mx-auto mt-16 max-w-[1200px] font-serif text-[clamp(42px,6vw,72px)] font-light leading-[1.1] tracking-[-0.03em]">
          "La Academia ha sido la <em className="font-normal italic">mejor inversión</em> que hemos hecho con mi equipo de socios. Estrategias prácticas, <em className="font-normal italic">no teoría.</em>"
        </blockquote>
        <p className="mt-12 font-serif text-[22px] italic">— Lic. Cristian Orlando García Cruz</p>
        <p className={`${mono} mt-2`}>Director de consultoría administrativa y fiscal</p>
        <div className="mt-10 flex justify-center gap-2">
          {[0, 1, 2, 3, 4].map((dot) => <span key={dot} className={`size-1.5 rounded-full ${dot === 0 ? 'bg-[#0a0a0a]' : 'bg-[#0a0a0a]/20'}`} />)}
        </div>
      </section>

      <section className={`${cream} border-b ${line} px-5 py-24 md:px-10 lg:px-14 lg:py-[140px]`}>
        <SectionIntro index="08" label="FAQ" side="6 preguntas">
          <EditorialTitle>
            Preguntas
            <span className="block"><em className="font-normal italic">frecuentes.</em></span>
          </EditorialTitle>
        </SectionIntro>
        <div className={`mx-auto mt-20 max-w-[1000px] border-t ${line}`}>
          {faqs.map((faq, index) => (
            <article key={faq.question} className={`grid gap-5 border-b ${line} py-8 md:grid-cols-[60px_minmax(0,1fr)_40px]`}>
              <p className="font-serif text-2xl font-light italic text-[#0a0a0a]/40">{String(index + 1).padStart(2, '0')}.</p>
              <div>
                <h3 className="font-serif text-[32px] font-light leading-tight tracking-[-0.015em]">{faq.question}</h3>
                <p className="mt-3 text-base leading-[1.7] text-[#0a0a0a]/65">{faq.answer}</p>
              </div>
              <span className="text-right text-2xl text-[#0a0a0a]/40">{faq.open ? '−' : '+'}</span>
            </article>
          ))}
        </div>
      </section>

      <section className={`${cream} px-5 py-24 text-center md:px-10 lg:px-14 lg:py-[140px]`}>
        <p className={mono}>09 / Empieza hoy</p>
        <h2 className="mt-8 font-serif text-[clamp(58px,8vw,96px)] font-light leading-none tracking-[-0.04em]">
          El éxito ama la preparación.
        </h2>
        <p className="mx-auto mt-8 max-w-[680px] font-serif text-[28px] text-[#0a0a0a]/65">
          "La mejor forma de prevenir una emergencia fiscal es la capacitación"
        </p>
        <div className="mt-8">
          <ButtonLike dark onClick={() => startAcademyCheckout(plans[1])}>Empezar a aprender</ButtonLike>
        </div>
      </section>
    </div>
  );
}
