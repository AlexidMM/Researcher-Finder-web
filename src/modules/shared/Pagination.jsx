import './pagination.scss';

export default function Pagination({ page = 1, totalPages = 1, onChange }) {
  const prev = () => onChange(Math.max(1, page - 1));
  const next = () => onChange(Math.min(totalPages, page + 1));

  return (
    <div className="pagination-wrap">
      <button onClick={prev} disabled={page <= 1} className="page-btn">Anterior</button>
      <span className="page-info">{page} / {totalPages}</span>
      <button onClick={next} disabled={page >= totalPages} className="page-btn">Siguiente</button>
    </div>
  );
}
