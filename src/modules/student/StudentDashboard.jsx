import PageShell from '../shared/PageShell';
import SectionHeader from '../shared/SectionHeader';
import RoleBreadcrumb from '../shared/RoleBreadcrumb';
import DashboardStats from '../shared/DashboardStats';
import QuickActions from '../shared/QuickActions';
import EstudianteImg from "../../assets/Estudiantes.jpg";

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
        description="Bienvenido. Toma el control de tu futuro académico conectando con las mejores oportunidades de investigación."
      />

      <img
          src={EstudianteImg}
          alt="Estudiantes investigando"
          className="explore-image"
      />

      <DashboardStats items={overviewStats} />

      <QuickActions
        title="Impulsa tu trayectoria: ¿Cuál es tu próximo objetivo?"
        items={[
          {
            label: 'Explorar directorio',
            description: 'Conecta con investigadores clave y descubre los laboratorios que buscan talento como el tuyo.',
            to: '/explore',
            variant: 'is-primary',
          },
          {
            label: 'Ver oportunidades',
            description: 'Encuentra becas, estancias y proyectos diseñados específicamente para catapultar tu carrera.',
            to: '/blog',
            variant: 'is-accent',
          },
          {
            label: 'Buscar conceptos',
            description: 'Consulta terminología científica y artículos de investigación para respaldar tus proyectos.',
            to: '/student/search',
          },
          {
            label: 'Mi perfil',
            description: 'Destaca entre la multitud. Mantén tus habilidades al día para atraer a los mejores mentores.',
            to: '/profile',
          },
        ]}
      />
    </PageShell>
  );
}
