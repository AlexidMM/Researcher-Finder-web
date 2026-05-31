import './tag-list.scss';

export default function TagList({ items = [] }) {
  return (
    <div className="tag-list">
      {items.map((t) => (
        <span key={t.id || t} className="tag-item">{t.name || t}</span>
      ))}
    </div>
  );
}
