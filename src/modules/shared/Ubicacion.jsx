import PageShell from "./PageShell";
import mapaImg from "../../assets/mapa.png";

export default function Ubicacion() {
  return (
    <PageShell
      wide
      breadcrumb={<span style={{ color: "#666" }}>Mapa de Sitio</span>}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "3rem 1rem",
          textAlign: "center",
          minHeight: "60vh",
        }}
      >
        <h1 style={{ color: "#0a2540", marginBottom: "1rem" }}>
          Mapa de Sitio
        </h1>
        <p
          style={{ color: "#4a5568", maxWidth: "600px", marginBottom: "2rem" }}
        >
          Te perdiste navegando por el sitio? No te preocupes, aquí tienes el
          mapa.
        </p>

        {/* Contenedor centrado para tu imagen */}
        <div
          style={{
            width: "100%",
            maxWidth: "800px",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            border: "4px solid #173a5e",
          }}
        >
          {/* Cambia el src por la ruta real de tu imagen cuando la tengas */}
          <img
            src={mapaImg}
            alt="Mapa del Sitio"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      </div>
    </PageShell>
  );
}
