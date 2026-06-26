import PageShell from "../shared/PageShell";
import SectionHeader from "../shared/SectionHeader";
import RoleBreadcrumb from "../shared/RoleBreadcrumb";
import ResearchersManager from "./ResearchersManager";
import AdminSidebar from "./AdminSidebar";
import "./admin.scss";

export default function AdminResearchersPage({ counts }) {
  return (
    <PageShell
      wide
      hideTopNav={true}
      sidebar={<AdminSidebar counts={counts} />}
      breadcrumb={<RoleBreadcrumb current="Investigadores" />}
    >
      <SectionHeader
        title="Gestión de Investigadores"
        description="Alta, edición y eliminación de perfiles investigadores."
      />

      <section className="admin-content">
        <ResearchersManager />
      </section>
    </PageShell>
  );
}
