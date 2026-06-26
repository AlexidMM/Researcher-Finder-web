import { Link } from "react-router-dom";
import { useState } from "react";
import { apiFetch } from "../../utils/api";
import "./footer.scss";

export default function Footer() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;

  const links =
    role === "student"
      ? [
          { label: "Dashboard", to: "/student/dashboard" },
          { label: "Explorar", to: "/explore" },
          { label: "Blog", to: "/blog" },
          { label: "Perfil", to: "/profile" },
        ]
      : role === "researcher"
        ? [
            { label: "Dashboard", to: "/researcher/dashboard" },
            { label: "Blog", to: "/blog" },
            { label: "Perfil", to: "/profile" },
          ]
        : role === "admin"
          ? [
              { label: "Dashboard", to: "/admin/dashboard" },
              { label: "Blog", to: "/blog" },
              { label: "Perfil", to: "/profile" },
            ]
          : [
              { label: "Iniciar sesión", to: "/" },
              { label: "Registrarse", to: "/register" },
              { label: "Blog", to: "/blog" },
            ];
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !message) return alert("Por favor, llena los campos.");

    try {
      // Ajusta las opciones de apiFetch según cómo lo tengas configurado, pero suele ser así:
      await apiFetch("/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });
      alert("¡Mensaje enviado con éxito!");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error(error);
      alert("Error al enviar el mensaje.");
    }
  };

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-brand">
          <span className="footer-brand-name">Researcher Finder</span>
          <p>
            Conectando estudiantes, investigadores e instituciones con
            oportunidades reales.
          </p>

          {/* 8. Datos de Contacto */}
          <div
            style={{
              marginTop: "1rem",
              fontSize: "0.9rem",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            <p style={{ margin: "0.2rem 0" }}>
              Av. Pie de la Cuesta, Querétaro, Qro.
            </p>
            <p style={{ margin: "0.2rem 0" }}>contacto@researcherfinder.mx</p>
            <p style={{ margin: "0.2rem 0" }}>+52 (442) 000 0000</p>
          </div>

          {/* 9. Botones de Redes Sociales */}
          <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
            <a
              href="#"
              style={{
                textDecoration: "none",
                background: "#173a5e",
                padding: "0.4rem 0.8rem",
                borderRadius: "4px",
                color: "white",
              }}
            >
              FB
            </a>
            <a
              href="#"
              style={{
                textDecoration: "none",
                background: "#173a5e",
                padding: "0.4rem 0.8rem",
                borderRadius: "4px",
                color: "white",
              }}
            >
              IG
            </a>
            <a
              href="#"
              style={{
                textDecoration: "none",
                background: "#173a5e",
                padding: "0.4rem 0.8rem",
                borderRadius: "4px",
                color: "white",
              }}
            >
              X
            </a>
          </div>
        </div>

        <div className="footer-links-group">
          <h4>Navegación</h4>
          <nav className="footer-links" aria-label="Enlaces de pie de página">
            {links.map((link) => (
              <Link key={link.to} to={link.to} className="footer-link">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="footer-meta">
          <h4>Soporte y Contacto</h4>
          <nav className="footer-links" aria-label="Información del sitio">
            <Link to="/about" className="footer-link">
              Acerca de
            </Link>
            <Link to="/testimonials" className="footer-link">
              Testimonios
            </Link>
            <Link to="/cookies" className="footer-link">
              Aviso de cookies
            </Link>
            <Link to="/ubicacion" className="footer-link">
              Mapa de Sitio
            </Link>
          </nav>

          {/* 10. Formulario de Contacto */}
          <div style={{ marginTop: "1.5rem" }}>
            <h5 style={{ margin: "0 0 0.5rem 0", color: "#f6c844" }}>
              Buzón de Quejas / Dudas
            </h5>
            {/* AGREGAMOS onSubmit */}
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <input
                type="email"
                placeholder="Tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "none",
                  fontSize: "0.85rem",
                }}
              />
              <textarea
                placeholder="¿En qué te ayudamos?"
                rows="2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "none",
                  resize: "vertical",
                  fontSize: "0.85rem",
                }}
              />
              {/* CAMBIAMOS A type="submit" */}
              <button
                type="submit"
                style={{
                  background: "#f6c844",
                  color: "#0a2540",
                  border: "none",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="site-footer-bottom">
        <span>© {new Date().getFullYear()} Researcher Finder</span>
        <span>Hecho para explorar, colaborar y publicar.</span>
      </div>
    </footer>
  );
}
