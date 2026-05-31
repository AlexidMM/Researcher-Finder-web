import './info-panel.scss';

export default function InfoPanel({ title, children, className = '' }) {
  return (
    <section className={`info-panel-block ${className}`.trim()}>
      <h3>{title}</h3>
      <div className="info-panel-content">{children}</div>
    </section>
  );
}