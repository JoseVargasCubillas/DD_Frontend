import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import LeadCaptureModal from '@molecules/LeadCaptureModal';
import { requestDownloadableResource } from '@api/leads.api';
import phoneMockup from '../../../../assets/resources/calculadora-celular.png';
import googlePlayBadge from '../../../../assets/resources/google-play-badge.png';
import appStoreBadge from '../../../../assets/resources/app-store-badge.png';
import coverIngresos from '../../../../assets/resources/cover-ingresos-exentos-isr.png';
import coverAgenda from '../../../../assets/resources/cover-si-tu-agenda.png';
import coverBlindaje from '../../../../assets/resources/cover-guia-blindarte-sat.png';
import coverPartes from '../../../../assets/resources/cover-partes-relacionadas.png';
import ingresosPdf from '../../../../assets/resources/recurso-asesorias.pdf';
import agendaPdf from '../../../../assets/resources/recurso-rockefeller.pdf';
import blindajePdf from '../../../../assets/resources/recurso-estrategia-fiscal.pdf';
import partesPdf from '../../../../assets/resources/recurso-precios-transferencia.pdf';

type Resource = {
  id: string;
  title: string;
  description: string;
  size: string;
  fileUrl: string;
  coverImage: string;
};

const playStoreUrl =
  'https://play.google.com/store/apps/details?id=com.calculadorafiscal&pcampaignid=web_share';

const resources: Resource[] = [
  {
    id: 'ingresos-exentos-isr',
    title: 'Ingresos exentos de ISR',
    description: 'Documento guía para identificar ingresos exentos y criterios básicos de revisión.',
    size: '6.4 MB',
    fileUrl: ingresosPdf,
    coverImage: coverIngresos,
  },
  {
    id: 'si-tu-agenda-se-ve-asi',
    title: 'Si tu agenda se ve así: esto es para ti',
    description: 'Una lectura breve para detectar si tu operación fiscal ya necesita más estructura.',
    size: '2 MB',
    fileUrl: agendaPdf,
    coverImage: coverAgenda,
  },
  {
    id: 'guia-para-blindarte-del-sat',
    title: 'Guía para blindarte del SAT',
    description: 'Estrategia fiscal paso a paso para revisar documentos, riesgos y defensa preventiva.',
    size: '7.6 MB',
    fileUrl: blindajePdf,
    coverImage: coverBlindaje,
  },
  {
    id: 'partes-relacionadas',
    title: 'Partes relacionadas',
    description: 'Criterios de revisión para operaciones entre partes relacionadas y precios de transferencia.',
    size: '5.5 MB',
    fileUrl: partesPdf,
    coverImage: coverPartes,
  },
];

function getAbsoluteUrl(fileUrl: string) {
  if (/^https?:\/\//i.test(fileUrl)) return fileUrl;
  return `${window.location.origin}${fileUrl}`;
}

function ResourceCover({ resource }: { resource: Resource }) {
  return (
    <div className="relative aspect-square overflow-hidden bg-cream-200">
      <img
        src={resource.coverImage}
        alt={`Portada de ${resource.title}`}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
    </div>
  );
}

function DownloadCard({
  resource,
  onSelect,
}: {
  resource: Resource;
  onSelect: (resource: Resource) => void;
}) {
  return (
    <article
      className="group relative flex h-full min-h-[458px] flex-col overflow-hidden border border-ink-900/10 bg-white pb-20 shadow-[0_18px_45px_-36px_rgba(10,10,10,0.45)] transition-colors duration-200 hover:border-ink-900"
      style={{ minHeight: 458, paddingBottom: 86 }}
    >
      <ResourceCover resource={resource} />
      <div className="flex flex-1 flex-col p-7">
        <h3 className="text-[18px] font-bold uppercase leading-[1.12] text-ink-900">
          {resource.title}
        </h3>
        <p className="mt-3 text-[13px] leading-[1.55] text-ink-600">
          {resource.description}
        </p>
        <button
          type="button"
          onClick={() => onSelect(resource)}
          className="absolute bottom-7 left-7 right-7 inline-flex min-h-11 cursor-pointer items-center justify-center border border-ink-900 bg-ink-900 px-4 text-[11px] font-bold text-white transition-colors duration-200 hover:bg-white hover:text-ink-900 focus:outline-none focus:ring-2 focus:ring-ink-900 focus:ring-offset-2"
          style={{
            display: 'flex',
            minHeight: 44,
            left: 28,
            right: 28,
            bottom: 28,
            zIndex: 2,
          }}
        >
          Descargar PDF ({resource.size})
        </button>
      </div>
    </article>
  );
}

export default function Resources() {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const modalCopy = useMemo(() => {
    if (!selectedResource) return null;
    return {
      title: `Descarga ${selectedResource.title}`,
      description:
        'Déjanos tus datos y te enviamos este recurso por correo. Al enviar, también abriremos la descarga en tu navegador.',
    };
  }, [selectedResource]);

  return (
    <main className="bg-white text-ink-900">
      <section className="border-b border-ink-900/10 bg-white">
        <div className="mx-auto px-6 py-7 text-center md:py-8" style={{ maxWidth: 1120 }}>
          <h1
            className="font-bold uppercase leading-none"
            style={{ fontSize: 'clamp(40px, 4.4vw, 58px)', letterSpacing: '-0.025em' }}
          >
            Centro de recursos
          </h1>
        </div>
      </section>

      <section className="overflow-hidden border-b border-ink-900/10" style={{ backgroundColor: '#fff4dc' }}>
        <div
          className="mx-auto flex flex-col items-center justify-center gap-8 px-6 py-9 md:flex-row md:items-center md:justify-center md:gap-16 md:py-0"
          style={{ maxWidth: 990, minHeight: 382 }}
        >
          <div
            className="order-2 flex shrink-0 items-end justify-center self-stretch md:order-1"
            style={{ width: 360, maxWidth: '100%', minHeight: 320 }}
          >
            <img
              src={phoneMockup}
              alt="Vista de la Calculadora Fiscal en celular"
              className="w-auto max-w-none object-contain drop-shadow-[0_24px_34px_rgba(0,0,0,0.16)]"
              style={{ height: 'min(430px, 88vw)' }}
            />
          </div>

          <div className="order-1 w-full text-left md:order-2" style={{ maxWidth: 520 }}>
            <h2
              className="font-bold uppercase leading-tight"
              style={{ fontSize: 'clamp(26px, 2.55vw, 31px)', letterSpacing: '-0.01em' }}
            >
              Calculadora fiscal
            </h2>
            <p className="mt-9 font-bold leading-tight text-ink-900" style={{ fontSize: 16 }}>
              Del ábaco a la calculadora científica evolucionaste.
              <br />
              Tu forma de calcular ISR, también debe hacerlo.
            </p>

            <div className="mt-8 space-y-1 leading-snug text-ink-800" style={{ fontSize: 15 }}>
            {[ 
                '¿Cuántas veces has calculado mal tu ISR?',
                '¿Le confías tus cálculos fiscales a un excel?',
                '¿Excel para lo más importante de tu negocio?',
              ].map((question) => (
                <p key={question} className="flex items-start gap-3">
                  <span className="translate-y-[-1px] text-[22px] font-bold leading-none text-ink-900">
                    ?
                  </span>
                  <span>{question}</span>
                </p>
              ))}
            </div>

            <p className="mt-8 font-bold leading-tight text-ink-900" style={{ fontSize: 16 }}>
              Los emprendedores mexicanos ya calculan mejor.
              <br />
              Ahora es tu turno.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Descargar Calculadora Fiscal en Google Play"
                className="inline-flex min-h-11 cursor-pointer transition-opacity hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-ink-900 focus:ring-offset-2"
              >
                <img
                  src={googlePlayBadge}
                  alt="Disponible en Google Play"
                  className="w-auto"
                  style={{ height: 44 }}
                />
              </a>
              <button
                type="button"
                onClick={() => toast('App Store está en mantenimiento y pronto volverá a estar disponible.')}
                aria-label="App Store en mantenimiento"
                className="inline-flex min-h-11 cursor-pointer transition-opacity hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-ink-900 focus:ring-offset-2"
              >
                <img
                  src={appStoreBadge}
                  alt="Disponible en App Store"
                  className="w-auto"
                  style={{ height: 44 }}
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-app py-12 lg:py-16">
          <div className="mb-10 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-400">
              PDF · Descarga con correo
            </p>
            <h2 className="mt-3 text-[clamp(34px,4.4vw,56px)] font-bold uppercase leading-none tracking-[-0.035em]">
              Material descargable
            </h2>
          </div>

          <div className="mx-auto grid max-w-[1080px] gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {resources.map((resource) => (
              <DownloadCard key={resource.id} resource={resource} onSelect={setSelectedResource} />
            ))}
          </div>
        </div>
      </section>

      <LeadCaptureModal
        open={Boolean(selectedResource)}
        onClose={() => setSelectedResource(null)}
        resource="downloadable-resource"
        requireName
        requirePhone
        title={modalCopy?.title}
        description={modalCopy?.description}
        submitLabel="Enviar y descargar"
        fallbackDownloadUrl={selectedResource?.fileUrl}
        fallbackFilename={selectedResource ? `${selectedResource.id}.pdf` : undefined}
        submit={(email, name, phone) => {
          if (!selectedResource) return Promise.resolve();
          return requestDownloadableResource({
            email,
            name,
            phone,
            resourceId: selectedResource.id,
            resourceTitle: selectedResource.title,
            downloadUrl: getAbsoluteUrl(selectedResource.fileUrl),
          });
        }}
      />
    </main>
  );
}
