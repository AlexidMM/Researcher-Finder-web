import './highlight-card.scss';

export default function HighlightCard({ title, value, subtitle }) {
  return (
    <div className="highlight-card">
      <div className="highlight-card-main">
        <div className="highlight-card-value">{value}</div>
        <div className="highlight-card-title">{title}</div>
      </div>
      {subtitle && <div className="highlight-card-sub">{subtitle}</div>}
    </div>
  );
}
