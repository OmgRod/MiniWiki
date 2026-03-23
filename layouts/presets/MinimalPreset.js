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
  return (
    <div className="min-h-full" data-wiki-preset="minimal">
      <Header
        headerConfig={headerConfig}
        searchDocuments={searchDocuments}
        siteConfig={siteConfig}
      />
      <div className="mx-auto max-w-5xl px-4 py-6 md:py-8">
        <div className="mb-6">
          <Sidebar
            sidebarConfig={sidebarConfig}
            currentPath={currentPath}
            sidebarWidthClass="md:w-full"
          />
        </div>
        <main className="w-full">{children}</main>
      </div>
      <Footer siteConfig={siteConfig} footerConfig={footerConfig} />
    </div>
  );
}
