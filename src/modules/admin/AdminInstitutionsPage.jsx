import PageShell from '../shared/PageShell';
import SectionHeader from '../shared/SectionHeader';
import RoleBreadcrumb from '../shared/RoleBreadcrumb';
import InstitutionsManager from './InstitutionsManager';
import './admin.scss';

export default function AdminInstitutionsPage() {
  return (
    <PageShell
      wide
      breadcrumb={<RoleBreadcrumb current="Instituciones" />}
    >
      <SectionHeader
        title="Gestión de Instituciones"
        description="Administra instituciones afiliadas y su información de contacto."
      />

      <section className="admin-content">
        <InstitutionsManager />
      </section>
    </PageShell>
  );
}
