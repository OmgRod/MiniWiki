import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

export default function PortalPreset({
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
    <div className="min-h-full" data-wiki-preset="portal">
      <Header
        headerConfig={headerConfig}
        searchDocuments={searchDocuments}
        siteConfig={siteConfig}
      />
      <div className="mx-auto max-w-[92rem] px-4 py-6 md:py-8">
        <div className="rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70">
          <div className="flex flex-col md:min-h-[calc(100vh-180px)] md:flex-row">
            <Sidebar
              sidebarConfig={sidebarConfig}
              currentPath={currentPath}
              sidebarWidthClass={sidebarWidthClass}
            />
            <main className="w-full p-6 md:p-10">{children}</main>
          </div>
        </div>
      </div>
      <Footer siteConfig={siteConfig} footerConfig={footerConfig} />
    </div>
  );
}
