import PageShell from './PageShell';
import SectionHeader from './SectionHeader';
import './info-pages.scss';

export default function About() {
  return (
    <PageShell
      breadcrumb={<span>Acerca de</span>}
    >
      <SectionHeader
        title="Acerca de Researcher Finder"
        description="Conectamos talento estudiantil con investigadores e instituciones que buscan colaboración real."
      />

      <section className="info-page-card">
        <h2>Quiénes somos</h2>
        <p>
          Researcher Finder es un proyecto académico orientado a facilitar oportunidades de becas,
          estancias y proyectos. Nuestro objetivo es reducir la distancia entre la curiosidad del
          estudiante y la experiencia del investigador.
        </p>
        <p>
          Trabajamos con enfoque en claridad, acceso y colaboración, para que el proceso de encontrar
          oportunidades sea simple y útil para toda la comunidad.
        </p>
      </section>
    </PageShell>
  );
}
