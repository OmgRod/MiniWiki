import Badge from '../components/Badge';

export default function GuideTemplate({ title, description, children, templateConfig = {} }) {
  const level = templateConfig.level || 'Guide';
  const audience = templateConfig.audience || '';

  return (
    <div>
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex flex-wrap gap-2">
          <Badge variant="primary">{level}</Badge>
          {audience ? <Badge variant="default">Audience: {audience}</Badge> : null}
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{title}</h1>
        {description ? <p className="mt-2 text-slate-600 dark:text-slate-300">{description}</p> : null}
      </div>
      <article className="mdx-content prose prose-slate max-w-none dark:prose-invert">{children}</article>
    </div>
  );
}
