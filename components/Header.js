import Link from 'next/link';
import DarkModeToggle from './DarkModeToggle';
import SearchBar from './SearchBar';
import { normalizeAssetPath } from '../lib/asset-path';

function isExternal(path = '') {
  return path.startsWith('http://') || path.startsWith('https://');
}

export default function Header({ headerConfig, searchDocuments, siteConfig }) {
  const links = headerConfig?.links || [];
  const siteName = siteConfig?.siteName || 'MiniWiki';
  const branding = siteConfig?.branding || {};
  const logoPath = typeof branding.logoPath === 'string' ? branding.logoPath.trim() : '';
  const resolvedLogoPath = normalizeAssetPath(logoPath);
  const brandText =
    typeof branding.text === 'string' && branding.text.trim() ? branding.text.trim() : siteName;
  const displayMode = branding.display || (logoPath ? 'logo-and-text' : 'text-only');
  const showLogo = Boolean(logoPath) && displayMode !== 'text-only';
  const showText = displayMode !== 'logo-only';
  const logoAlt =
    typeof branding.logoAlt === 'string' && branding.logoAlt.trim()
      ? branding.logoAlt.trim()
      : `${brandText} logo`;
  const logoClassName =
    typeof branding.logoClassName === 'string' && branding.logoClassName.trim()
      ? branding.logoClassName.trim()
      : 'h-7 w-auto';
  const showSearch = siteConfig?.header?.showSearch !== false;
  const showDarkModeToggle = siteConfig?.header?.showDarkModeToggle !== false;
  const searchPlaceholder = siteConfig?.header?.searchPlaceholder || 'Search docs...';
  const maxWidthClass = siteConfig?.layout?.maxWidthClass || 'max-w-7xl';

  return (
    <header className="miniwiki-header sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className={`miniwiki-header-inner mx-auto flex ${maxWidthClass} items-center gap-4 px-4 py-3`}>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100"
          aria-label={brandText}
        >
          {showLogo ? <img src={resolvedLogoPath} alt={logoAlt} className={logoClassName} /> : null}
          {showText ? <span>{brandText}</span> : null}
          {!showLogo && !showText ? <span>{siteName}</span> : null}
        </Link>

        <div className="ml-auto hidden gap-3 md:flex">
          {links.map((link) => {
            if (isExternal(link.path)) {
              return (
                <a
                  key={`${link.title}-${link.path}`}
                  href={link.path}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md px-2 py-1 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {link.title}
                </a>
              );
            }

            return (
              <Link
                key={`${link.title}-${link.path}`}
                href={link.path}
                className="rounded-md px-2 py-1 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {link.title}
              </Link>
            );
          })}
        </div>

        {showSearch ? (
          <SearchBar documents={searchDocuments} placeholder={searchPlaceholder} />
        ) : null}
        {showDarkModeToggle ? <DarkModeToggle /> : null}
      </div>
    </header>
  );
}
