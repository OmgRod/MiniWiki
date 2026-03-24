import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

export default function MinimalPreset({
  children,
  sidebarConfig,
  headerConfig,
  currentPath,
  searchDocuments,
  siteConfig,
  footerConfig,
}) {
  const sidebarWidthClass = siteConfig?.layout?.sidebarWidthClass || 'md:w-72';

  return (
    <div className="min-h-full" data-wiki-preset="minimal">
      <Header
        headerConfig={headerConfig}
        searchDocuments={searchDocuments}
        siteConfig={siteConfig}
      />
      <div className="mx-auto flex max-w-5xl flex-col px-4 py-6 md:min-h-[calc(100vh-64px)] md:flex-row md:gap-6 md:py-8">
        <Sidebar
          sidebarConfig={sidebarConfig}
          currentPath={currentPath}
          sidebarWidthClass={sidebarWidthClass}
        />
        <main className="w-full">{children}</main>
      </div>
      <Footer siteConfig={siteConfig} footerConfig={footerConfig} />
    </div>
  );
}
