import PageShell from "../shared/PageShell";
import SectionHeader from "../shared/SectionHeader";
import RoleBreadcrumb from "../shared/RoleBreadcrumb";
import InstitutionsManager from "./InstitutionsManager";
import AdminSidebar from "./AdminSidebar";
import "./admin.scss";

export default function AdminInstitutionsPage({ counts }) {
  return (
    <PageShell
      wide
      hideTopNav={true}
      sidebar={<AdminSidebar counts={counts} />}
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
