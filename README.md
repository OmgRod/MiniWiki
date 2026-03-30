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

- Top links and sidebar sections are now configured in `miniwiki.config.json`.
- Footer columns/links are now configured in `miniwiki.config.json`.

## Config

- Global behavior: `content/site.json`
- Optional page templates: `content/templates.json`

## Icons

MiniWiki supports named icons via `lucide-react`:

```mdx
<Icon name="settings" />
<Callout icon="rocket">Launch docs faster.</Callout>
```

### Configuration

All configurations are now consolidated in `miniwiki.config.json`. This file contains settings for:

- **Next.js Configuration**: Export paths, locales, and other Next.js settings.
- **Tailwind CSS**: Theme and plugin configurations.
- **Navigation**: Header, footer, and sidebar links.
- **Templates**: Default and custom templates.

#### Example

```javascript
const config = require('./miniwiki.config');

module.exports = config.nextConfig;
```

Refer to `miniwiki.config.json` for detailed settings.
