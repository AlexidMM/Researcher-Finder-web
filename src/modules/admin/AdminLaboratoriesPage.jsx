import PageShell from "../shared/PageShell";
import SectionHeader from "../shared/SectionHeader";
import RoleBreadcrumb from "../shared/RoleBreadcrumb";
import LaboratoriesManager from "./LaboratoriesManager";
import AdminSidebar from "./AdminSidebar";
import "./admin.scss";

export default function AdminLaboratoriesPage({ counts }) {
  return (
    <PageShell
      wide
      hideTopNav={true}
      sidebar={<AdminSidebar counts={counts} />}
      breadcrumb={<RoleBreadcrumb current="Laboratorios" />}
    >
      <SectionHeader
        title="Gestión de Laboratorios"
        description="Administra las sedes físicas asignadas a instituciones o investigadores independientes."
      />

      <section className="admin-content">
        <LaboratoriesManager />
      </section>
    </PageShell>
  );
}