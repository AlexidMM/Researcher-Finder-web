import './flutter-stats-embed.scss';

export default function FlutterStatsEmbed() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const flutterStatsUrl = import.meta.env.VITE_FLUTTER_STATS_URL;
  const token = localStorage.getItem('access_token');

  if (!flutterStatsUrl) {
    return (
      <section className="flutter-stats-embed flutter-stats-embed--missing">
        <p>
          Configura <code>VITE_FLUTTER_STATS_URL</code> en tu archivo <code>.env</code> para
          mostrar el dashboard Flutter embebido.
        </p>
      </section>
    );
  }

  if (!token) {
    return (
      <section className="flutter-stats-embed flutter-stats-embed--missing">
        <p>Inicia sesión como investigador para ver las estadísticas embebidas.</p>
      </section>
    );
  }

  const embedUrl = `${flutterStatsUrl}?token=${encodeURIComponent(token)}&apiUrl=${encodeURIComponent(apiUrl)}`;

  return (
    <section className="flutter-stats-embed" aria-label="Estadísticas Flutter embebidas">
      <div className="flutter-stats-embed__header">
        <h2>Dashboard Flutter (Práctica 8)</h2>
        <p>Componente compilado con Flutter Web e incrustado en React mediante iframe.</p>
      </div>
      <iframe
        title="Estadísticas de publicaciones"
        src={embedUrl}
        className="flutter-stats-embed__frame"
        loading="lazy"
      />
    </section>
  );
}
