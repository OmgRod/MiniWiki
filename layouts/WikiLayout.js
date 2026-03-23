import { resolveWikiPreset } from './presets';

export default function WikiLayout({
  children,
  sidebarConfig,
  headerConfig,
  currentPath,
  searchDocuments,
  siteConfig,
  footerConfig,
}) {
  const wikiPreset = siteConfig?.wikiPreset || 'docs';
  const Preset = resolveWikiPreset(wikiPreset);

  return (
    <Preset
      sidebarConfig={sidebarConfig}
      headerConfig={headerConfig}
      currentPath={currentPath}
      searchDocuments={searchDocuments}
      siteConfig={siteConfig}
      footerConfig={footerConfig}
    >
      {children}
    </Preset>
  );
}
