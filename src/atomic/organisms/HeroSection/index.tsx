import { Link } from 'react-router-dom';
import Button from '@atoms/Button';

export default function HeroSection() {
  return (
    <section className="relative bg-dark-900 overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="container-app relative flex flex-col items-center text-center gap-8">
        <span className="bg-brand-500/20 text-brand-400 text-sm font-medium px-4 py-1.5 rounded-full">
          Estrategia Fiscal Profesional
        </span>
        <h1 className="section-title max-w-4xl leading-tight">
          El arquitecto de soluciones donde{' '}
          <span className="text-brand-400">otros solo ven problemas</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Contabilidad, derecho corporativo y estrategia fiscal. Cursos, seminarios y consultoría para transformar tu visión financiera.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/cursos"><Button size="lg">Ver cursos</Button></Link>
          <Link to="/eventos"><Button size="lg" variant="secondary">Próximos eventos</Button></Link>
        </div>
      </div>
    </section>
  );
}
