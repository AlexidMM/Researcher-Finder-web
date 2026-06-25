import PageShell from './PageShell';
import SectionHeader from './SectionHeader';
import './info-pages.scss';

const testimonials = [
  {
    id: 1,
    quote: 'Encontré mi primera estancia en menos de dos semanas. El proceso fue claro y directo.',
    author: 'Ana P., Estudiante',
  },
  {
    id: 2,
    quote: 'Publicar una oportunidad y filtrar candidatos fue mucho más sencillo de lo esperado.',
    author: 'Dr. Luis R., Investigador',
  },
  {
    id: 3,
    quote: 'La plataforma nos ayudó a visibilizar líneas de investigación para atraer talento nuevo.',
    author: 'Institución colaboradora',
  },
];

export default function Testimonials() {
  return (
    <PageShell
      wide
      breadcrumb={<span>Testimonios</span>}
    >
      <SectionHeader
        title="Testimonios"
        description="Experiencias de estudiantes, investigadores e instituciones que usan la plataforma."
      />

      <section className="info-page-grid">
        {testimonials.map((item) => (
          <article key={item.id} className="info-page-card">
            <p className="testimonial-quote">"{item.quote}"</p>
            <p className="testimonial-author">{item.author}</p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
