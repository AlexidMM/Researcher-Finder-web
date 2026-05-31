import './filter-bar.scss';

export default function FilterBar({ label, options, value, onChange }) {
  return (
    <section className="filter-bar" aria-label={label}>
      <span className="filter-bar-label">{label}</span>
      <div className="filter-bar-options">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`filter-bar-btn ${value === option.value ? 'is-active' : ''}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}