import './search-bar.scss';

export default function SearchBar({ value, onChange, placeholder = 'Buscar...' }) {
  return (
    <div className="search-bar-wrap">
      <input
        className="search-input"
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
