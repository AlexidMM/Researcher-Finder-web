import PageShell from './PageShell';
import SectionHeader from './SectionHeader';
import './info-pages.scss';

export default function Privacy() {
  return (
    <PageShell
      breadcrumb={<span>Aviso de Privacidad</span>}
    >
      <SectionHeader
        title="Aviso de Privacidad"
        description="Conoce cómo protegemos y utilizamos tu información en Researcher Finder."
      />

      <section className="info-page-card">
        <h2>Protección de tus Datos</h2>
        <p>
          En Researcher Finder valoramos tu privacidad. Toda la información personal, académica y de 
          contacto que nos proporciones será utilizada única y exclusivamente para conectarte con 
          oportunidades de investigación, becas y estancias.
        </p>
        <p>
          No compartiremos tu información con terceros sin tu consentimiento expreso. Como usuario, 
          tienes el derecho de acceder, rectificar o eliminar tu información en cualquier momento 
          desde la configuración de tu perfil.
        </p>
        <p>
          Si tienes alguna duda sobre el manejo de tus datos, puedes contactarnos en nuestro buzón 
          de dudas en la parte inferior de la página.
        </p>
      </section>
    </PageShell>
  );
}
