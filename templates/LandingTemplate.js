import ButtonLink from '../components/ButtonLink';
import CardGrid from '../components/CardGrid';
import Card from '../components/Card';

export default function LandingTemplate({ title, description, children, templateConfig = {} }) {
  const cta = templateConfig.cta || { label: 'Get Started', href: '/guides/usage' };
  const features = templateConfig.features || [];

  return (
    <div>
      <section className="mb-8 rounded-xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="mb-3 text-4xl font-black text-slate-900 dark:text-slate-100">{title}</h1>
        {description ? <p className="mb-5 text-lg text-slate-600 dark:text-slate-300">{description}</p> : null}
        <ButtonLink href={cta.href} variant="primary">
          {cta.label}
        </ButtonLink>
      </section>

      {features.length ? (
        <CardGrid>
          {features.map((feature) => (
            <Card key={feature.title} title={feature.title} description={feature.description} />
          ))}
        </CardGrid>
      ) : null}

      <article className="mdx-content prose prose-slate mt-8 max-w-none dark:prose-invert">{children}</article>
    </div>
  );
}
