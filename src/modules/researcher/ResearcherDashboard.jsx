import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../shared/PageShell';
import SectionHeader from '../shared/SectionHeader';
import RoleBreadcrumb from '../shared/RoleBreadcrumb';
import DashboardStats from '../shared/DashboardStats';
import QuickActions from '../shared/QuickActions';
import { apiFetch } from '../../utils/api';

export default function ResearcherDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ active: 0, closed: 0, scholarships: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await apiFetch('/publications/mine');
        const publications = Array.isArray(data) ? data : [];
        setStats({
          active: publications.filter((p) => p.status).length,
          closed: publications.filter((p) => !p.status).length,
          scholarships: publications.filter((p) => p.type === 'scholarship' && p.status).length,
        });
      } catch (err) {
        console.error(err);
      }
    };

    loadStats();
  }, []);

  const dashboardStats = [
    { label: 'Activas', value: stats.active, helpText: 'Visibles para estudiantes.' },
    { label: 'Cerradas', value: stats.closed, helpText: 'Ya no aparecen en el directorio.' },
    { label: 'Becas activas', value: stats.scholarships, helpText: 'Publicaciones tipo beca.' },
  ];

  return (
    <PageShell
      breadcrumb={<RoleBreadcrumb current="Inicio" />}
    >
      <SectionHeader
        title="Panel de Investigador"
        description="Resumen de tu actividad. Gestiona tus publicaciones desde la web; el wearable recibirá alertas vía API."
      />

      <DashboardStats items={dashboardStats} />

      <QuickActions
        title="Accesos directos"
        items={[
          {
            label: 'Nueva publicación',
            description: 'Publica una beca, estancia o proyecto.',
            to: '/researcher/create-publication',
            variant: 'is-primary',
          },
          {
            label: 'Mis publicaciones',
            description: 'Edita, activa o cierra convocatorias.',
            to: '/researcher/publications',
            variant: 'is-accent',
          },
          {
            label: 'Mi perfil',
            description: 'Actualiza tu información.',
            to: '/profile',
          },
        ]}
      />

      <section className="researcher-cta-banner">
        <div>
          <h2>¿Lista una nueva oportunidad?</h2>
          <p>Publica desde la web; el wearable te avisará cuando cambie el estado.</p>
        </div>
        <button type="button" className="btn-create-post" onClick={() => navigate('/researcher/create-publication')}>
          + Crear publicación
        </button>
      </section>
    </PageShell>
  );
}
