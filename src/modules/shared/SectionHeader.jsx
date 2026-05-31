import './section-header.scss';

export default function SectionHeader({ title, description, className = '' }) {
  return (
    <header className={`section-header ${className}`.trim()}>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}