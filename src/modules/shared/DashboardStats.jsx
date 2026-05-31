import './dashboard-stats.scss';

export default function DashboardStats({ items }) {
  return (
    <section className="dashboard-stats" aria-label="Resumen rápido">
      {items.map((item) => (
        <article key={item.label} className="dashboard-stat-card">
          <span className="dashboard-stat-value">{item.value}</span>
          <span className="dashboard-stat-label">{item.label}</span>
          {item.helpText && <p className="dashboard-stat-help">{item.helpText}</p>}
        </article>
      ))}
    </section>
  );
}