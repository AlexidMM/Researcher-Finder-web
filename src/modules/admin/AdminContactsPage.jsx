import { useEffect, useState } from "react";
import PageShell from "../shared/PageShell";
import SectionHeader from "../shared/SectionHeader";
import RoleBreadcrumb from "../shared/RoleBreadcrumb";
import AdminSidebar from "./AdminSidebar";
import { apiFetch } from "../../utils/api";

export default function AdminContactsPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await apiFetch("/contacts");
        setMessages(data || []);
      } catch (err) {
        console.error("Error cargando mensajes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  return (
    <PageShell
      wide
      hideTopNav={true}
      sidebar={<AdminSidebar />}
      breadcrumb={<RoleBreadcrumb current="Buzón de Mensajes" />}
    >
      <SectionHeader
        title="Buzón de Contacto"
        description="Aquí puedes ver las quejas, dudas y sugerencias que envía la gente desde el Footer."
      />

      <div className="admin-content admin-manager">
        {loading ? (
          <p className="admin-loading">Cargando mensajes...</p>
        ) : messages.length === 0 ? (
          <p className="admin-empty-state">
            No hay mensajes en la bandeja de entrada.
          </p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Correo</th>
                  <th>Mensaje</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr key={msg.id}>
                    <td>
                      <strong>{msg.email}</strong>
                    </td>
                    <td>{msg.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageShell>
  );
}
