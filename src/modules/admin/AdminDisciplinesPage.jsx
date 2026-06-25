import PageShell from '../shared/PageShell';
import SectionHeader from '../shared/SectionHeader';
import RoleBreadcrumb from '../shared/RoleBreadcrumb';
import DisciplinesManager from './DisciplinesManager';
import './admin.scss';

export default function AdminDisciplinesPage() {
  return (
    <PageShell
      wide
      breadcrumb={<RoleBreadcrumb current="Disciplinas" />}
    >
      <SectionHeader
        title="Gestión de Disciplinas"
        description="Define las áreas de conocimiento disponibles en la plataforma."
      />

      <section className="admin-content">
        <DisciplinesManager />
      </section>
    </PageShell>
  );
}
