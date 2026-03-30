import Badge from '../components/Badge';
import { useRouter } from 'next/router';

function TableOfContents({ sections = [] }) {
  if (!sections.length) {
    return null;
  }

  return (
    <aside className="mb-6 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">On this page</p>
      <ul className="space-y-1 text-sm">
        {sections.map((section) => (
          <li key={section.href}>
            <a href={section.href}>{section.label}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default function ReferenceTemplate({ title, description, children, templateConfig = {} }) {
  const router = useRouter();
  const version = templateConfig.version || 'v1';
  const sections = templateConfig.sections || [];

  const handleVersionChange = (event) => {
    const selectedVersion = event.target.value;
    router.push(`/docs/${selectedVersion}`);
  };

  return (
    <div>
      <header className="mb-6 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="mb-2">
          <Badge variant="success">Reference {version}</Badge>
        </div>
        <select
          value={version}
          onChange={handleVersionChange}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          <option value="v1">v1</option>
          <option value="v2">v2</option>
        </select>
      </header>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <TableOfContents sections={sections} />
        <article className="mdx-content prose prose-slate max-w-none dark:prose-invert">{children}</article>
      </div>
    </div>
  );
}
