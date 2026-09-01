import bookClaves from '../../../../assets/ddweb/libro-siete-claves-cobrar.png';
import bookSat from '../../../../assets/ddweb/libro-siete-secretos-sat.png';
import bookFiscalista from '../../../../assets/ddweb/libro-siete-secretos-fiscalista.png';

const border = 'border-ink-900/10';

interface BookStackProps {
  // Cuando se usa para representar el bundle (que ya no incluye el libro
  // del SAT como ejemplar físico), esto pone esa portada en gris con una
  // etiqueta — misma posición y misma animación, solo se distingue que no
  // está disponible.
  dimSat?: boolean;
}

// Composición animada de las 3 portadas en abanico, con hover 3D. Vive aquí
// (en vez de solo en la página de Libros) para poder reutilizarla tal cual
// — mismo look, misma animación — en el resumen del checkout del bundle.
export default function BookStack({ dimSat = false }: BookStackProps) {
  return (
    <div className="group relative mx-auto h-[330px] w-full max-w-[520px] cursor-pointer [perspective:1400px] sm:h-[420px] lg:h-[440px] lg:max-w-[560px]">
      <img
        src={bookFiscalista}
        alt="Portada 7 Secretos de un fiscalista"
        className={`absolute left-[5%] top-[16%] h-[230px] w-[146px] -rotate-[6deg] border ${border} object-cover shadow-xl transition-all duration-300 ease-out [transform-style:preserve-3d] group-hover:-translate-x-4 group-hover:-translate-y-2 group-hover:-rotate-[10deg] group-hover:shadow-[0_28px_54px_rgba(0,0,0,0.22)] sm:h-[315px] sm:w-[200px] lg:h-[350px] lg:w-[222px]`}
      />
      <img
        src={bookClaves}
        alt="Portada 7 Claves para cobrar a tu empresa"
        className={`absolute left-1/2 top-[2%] z-20 h-[270px] w-[171px] -translate-x-1/2 rotate-[2deg] border ${border} object-cover shadow-2xl transition-all duration-300 ease-out [transform-style:preserve-3d] group-hover:-translate-y-5 group-hover:rotate-[0deg] group-hover:shadow-[0_38px_70px_rgba(0,0,0,0.3)] sm:h-[360px] sm:w-[228px] lg:h-[400px] lg:w-[254px]`}
      />
      <div
        className={`absolute right-[4%] top-[19%] h-[235px] w-[149px] rotate-[7deg] transition-all duration-300 ease-out [transform-style:preserve-3d] group-hover:translate-x-4 group-hover:-translate-y-2 group-hover:rotate-[11deg] sm:h-[315px] sm:w-[200px] lg:h-[355px] lg:w-[225px]`}
      >
        <img
          src={bookSat}
          alt={
            dimSat
              ? 'Portada Los 7 secretos que el SAT no quiere que conozcas — no disponible, lista de espera'
              : 'Portada Los 7 secretos que el SAT no quiere que conozcas'
          }
          className={`h-full w-full border ${border} object-cover shadow-xl transition-all duration-300 ease-out group-hover:shadow-[0_28px_54px_rgba(0,0,0,0.22)] ${dimSat ? 'grayscale opacity-55' : ''}`}
        />
        {dimSat && (
          <span className="absolute inset-x-0 bottom-0 bg-ink-900/85 px-2 py-1.5 text-center text-[8px] font-bold uppercase leading-tight tracking-[0.14em] text-white sm:text-[9px]">
            Lista de espera
          </span>
        )}
      </div>
    </div>
  );
}
