import { Link } from 'react-router-dom';
import './quick-actions.scss';

export default function QuickActions({ items, title = 'Accesos rápidos' }) {
  return (
    <section className="quick-actions" aria-label={title}>
      <div className="quick-actions-header">
        <h2>{title}</h2>
      </div>

      <div className="quick-actions-list">
        {items.map((item) => (
          <Link key={item.to} to={item.to} className={`quick-action-btn ${item.variant || ''}`.trim()}>
            <span className="quick-action-title">{item.label}</span>
            {item.description && <span className="quick-action-desc">{item.description}</span>}
          </Link>
        ))}
      </div>
    </section>
  );
}