import PageShell from '../shared/PageShell';
import SectionHeader from '../shared/SectionHeader';
import RoleBreadcrumb from '../shared/RoleBreadcrumb';
import DashboardStats from '../shared/DashboardStats';
import QuickActions from '../shared/QuickActions';

export default function StudentDashboard() {
  const overviewStats = [
    { label: 'Sección activa', value: 'Inicio', helpText: 'Resumen de tu espacio como estudiante.' },
    { label: 'Exploración', value: 'Directorio', helpText: 'Investigadores e instituciones con oportunidades.' },
    { label: 'Blog', value: 'Oportunidades', helpText: 'Publicaciones activas filtrables por tipo.' },
  ];

  return (
    <PageShell
      breadcrumb={<RoleBreadcrumb current="Inicio" />}
    >
      <SectionHeader
        title="Panel de Estudiante"
        description="Bienvenido. Desde aquí accede a las secciones principales sin amontonar todo en una sola pantalla."
      />

      <DashboardStats items={overviewStats} />

      <QuickActions
        title="¿Qué quieres hacer?"
        items={[
          {
            label: 'Explorar directorio',
            description: 'Encuentra investigadores e instituciones.',
            to: '/explore',
            variant: 'is-primary',
          },
          {
            label: 'Ver oportunidades',
            description: 'Blog con becas, estancias y proyectos.',
            to: '/blog',
            variant: 'is-accent',
          },
          {
            label: 'Buscar conceptos',
            description: 'Búsqueda web de temas científicos.',
            to: '/student/search',
          },
          {
            label: 'Mi perfil',
            description: 'Revisa y actualiza tus datos.',
            to: '/profile',
          },
        ]}
      />
    </PageShell>
  );
}
