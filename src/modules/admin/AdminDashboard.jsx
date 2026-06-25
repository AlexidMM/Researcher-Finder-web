import { useEffect, useState } from 'react';
import PageShell from '../shared/PageShell';
import SectionHeader from '../shared/SectionHeader';
import RoleBreadcrumb from '../shared/RoleBreadcrumb';
import HighlightCard from '../shared/HighlightCard';
import AdminSidebar from './AdminSidebar';
import { apiFetch } from '../../utils/api';
import './admin.scss';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    researchers: 0,
    institutions: 0,
    disciplines: 0,
    publications: 0,
    pending: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [res, inst, disc, pubs] = await Promise.all([
          apiFetch('/researchers'),
          apiFetch('/institutions'),
          apiFetch('/disciplines'),
          apiFetch('/publications'),
        ]);
        setCounts({
          researchers: (res || []).length,
          institutions: (inst || []).length,
          disciplines: (disc || []).length,
          publications: (pubs || []).filter((p) => p.status === true).length,
          pending: (pubs || []).filter((p) => p.status === false).length,
        });
      } catch (err) {
        console.error('Error cargando conteos admin:', err);
      }
    };
    fetchCounts();
  }, []);

  return (
    <PageShell
      wide
      sidebar={<AdminSidebar counts={counts} />}
      breadcrumb={<RoleBreadcrumb current="Resumen" />}
    >
      <SectionHeader
        title="Panel de Administración"
        description="Vista general del sistema. Cada módulo tiene su propia sección en el menú."
      />

      <div className="admin-overview-grid">
        <HighlightCard title="Investigadores" value={counts.researchers} subtitle="Registrados" />
        <HighlightCard title="Instituciones" value={counts.institutions} subtitle="Registradas" />
        <HighlightCard title="Disciplinas" value={counts.disciplines} subtitle="Definidas" />
        <HighlightCard title="Publicaciones activas" value={counts.publications} subtitle="Visibles" />
        <HighlightCard title="Cerradas" value={counts.pending} subtitle="No visibles" />
      </div>
    </PageShell>
  );
}
