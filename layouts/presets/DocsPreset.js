import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

export default function DocsPreset({
  children,
  sidebarConfig,
  headerConfig,
  currentPath,
  searchDocuments,
  siteConfig,
  footerConfig,
}) {
  const maxWidthClass = siteConfig?.layout?.maxWidthClass || 'max-w-7xl';
  const sidebarWidthClass = siteConfig?.layout?.sidebarWidthClass || 'md:w-72';

  return (
    <div className="min-h-full" data-wiki-preset="docs">
      <Header
        headerConfig={headerConfig}
        searchDocuments={searchDocuments}
        siteConfig={siteConfig}
      />
      <div className={`mx-auto flex ${maxWidthClass} flex-col md:min-h-[calc(100vh-64px)] md:flex-row`}>
        <Sidebar
          sidebarConfig={sidebarConfig}
          currentPath={currentPath}
          sidebarWidthClass={sidebarWidthClass}
        />
        <main className="w-full p-6 md:p-8">{children}</main>
      </div>
      <Footer siteConfig={siteConfig} footerConfig={footerConfig} />
    </div>
  );
}
