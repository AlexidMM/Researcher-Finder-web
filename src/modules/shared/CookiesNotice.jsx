import PageShell from './PageShell';
import SectionHeader from './SectionHeader';
import './info-pages.scss';

export default function CookiesNotice() {
  return (
    <PageShell
      breadcrumb={<span>Aviso de cookies</span>}
    >
      <SectionHeader
        title="Aviso de Cookies"
        description="Te informamos cómo usamos cookies para mejorar tu experiencia en la plataforma."
      />

      <section className="info-page-card">
        <h2>Uso de cookies</h2>
        <p>
          Utilizamos cookies técnicas para mantener tu sesión activa y recordar preferencias básicas
          de navegación. Estas cookies son necesarias para el funcionamiento de la aplicación.
        </p>
        <p>
          También podemos usar métricas internas para mejorar rendimiento y experiencia de usuario.
          Puedes gestionar cookies desde la configuración de tu navegador.
        </p>
      </section>
    </PageShell>
  );
}
