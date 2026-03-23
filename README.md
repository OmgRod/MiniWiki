# MiniWiki

A clean, guide-first documentation wiki template built with Next.js, MDX, and TailwindCSS.

## Run

```bash
npm install
npm run dev
```

## Documentation content

This project now uses a full docs structure under `content/guides/`:

- `introduction.mdx`
- `quickstart.mdx`
- `content-structure.mdx`
- `navigation-config.mdx`
- `site-config.mdx`
- `components-and-icons.mdx`
- `theming-and-presets.mdx`
- `publishing-workflow.mdx`
- `troubleshooting.mdx`

## Navigation

- Top links: `content/header.json`
- Sidebar sections: `content/sidebar.json`
- Footer columns/links: `content/footer.json`

## Config

- Global behavior: `content/site.json`
- Optional page templates: `content/templates.json`

## Icons

MiniWiki supports named icons via `lucide-react`:

```mdx
<Icon name="settings" />
<Callout icon="rocket">Launch docs faster.</Callout>
```
