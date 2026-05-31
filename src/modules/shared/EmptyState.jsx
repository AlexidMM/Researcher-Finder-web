import './empty-state.scss';

export default function EmptyState({ title, description, actionLabel, onAction, compact = false }) {
  return (
    <div className={`empty-state ${compact ? 'is-compact' : ''}`}>
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel && onAction && (
        <button type="button" className="empty-state-action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}