import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Head from 'next/head';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import WikiLayout from '../layouts/WikiLayout';
import mdxComponents from '../components/mdx-components';
import { mergeTemplateConfig, resolveTemplate } from '../templates';
import Icon from '../components/Icon'
import { normalizeAssetPath } from '../lib/asset-path';

const {
  CONTENT_DIR,
  getAllRoutes,
  getFilePathFromSlugSegments,
  getPageMetaIndex,
} = require('../lib/content');
const {
  getHeaderConfig,
  getSidebarConfig,
  getSiteConfig,
  getTemplatesConfig,
  getFooterConfig,
} = require('../lib/navigation');

function toPosixPath(value = '') {
  return value.replace(/\\/g, '/');
}

function trimSlashes(value = '') {
  return value.replace(/^\/+|\/+$/g, '');
}

function joinUrlParts(...parts) {
  return parts
    .map((part) => trimSlashes(String(part || '')))
    .filter(Boolean)
    .join('/');
}

function normalizeRoutePath(routePath = '/') {
  if (!routePath) {
    return '/';
  }

  const normalized = `/${trimSlashes(String(routePath))}`;
  return normalized === '/' ? '/' : normalized.replace(/\/+$/, '');
}

function getNestedSidebarItems(item) {
  if (Array.isArray(item?.items)) {
    return item.items;
  }

  if (Array.isArray(item?.children)) {
    return item.children;
  }

  return [];
}

function appendOrderedSidebarItems(items, pages, seen) {
  for (const item of items || []) {
    const nestedItems = getNestedSidebarItems(item);

    if (nestedItems.length > 0) {
      appendOrderedSidebarItems(nestedItems, pages, seen);
      continue;
    }

    if (!item?.path) {
      continue;
    }

    const routePath = normalizeRoutePath(item.path);

    if (seen.has(routePath)) {
      continue;
    }

    seen.add(routePath);
    pages.push({
      title: item.title || routePath,
      path: routePath,
    });
  }
}

function getOrderedSidebarPages(sidebarConfig) {
  const sections = sidebarConfig?.sections || [];
  const pages = [];
  const seen = new Set();

  for (const section of sections) {
    appendOrderedSidebarItems(section?.items || [], pages, seen);
  }

  return pages;
}

function buildPageNavigation({ sidebarConfig, currentPath, frontmatter }) {
  const orderedPages = getOrderedSidebarPages(sidebarConfig);
  const normalizedCurrentPath = normalizeRoutePath(currentPath);
  const currentIndex = orderedPages.findIndex((page) => page.path === normalizedCurrentPath);

  if (currentIndex === -1) {
    return null;
  }

  const disablePrevPage = frontmatter?.disablePrevPage === true;
  const disableNextPage = frontmatter?.disableNextPage === true;

  const previous = !disablePrevPage && currentIndex > 0 ? orderedPages[currentIndex - 1] : null;
  const next =
    !disableNextPage && currentIndex < orderedPages.length - 1
      ? orderedPages[currentIndex + 1]
      : null;

  if (!previous && !next) {
    return null;
  }

  return {
    previous,
    next,
  };
}

function buildEditPageUrl({ siteConfig, relativePath, frontmatter }) {
  if (!relativePath || frontmatter?.editPage === false) {
    return null;
  }

  const config = siteConfig?.editPage || {};
  if (config.enabled === false) {
    return null;
  }

  if (typeof frontmatter?.editPageUrl === 'string' && frontmatter.editPageUrl.trim()) {
    return frontmatter.editPageUrl.trim();
  }

  if (typeof config.baseUrl === 'string' && config.baseUrl.trim()) {
    const safeBase = config.baseUrl.trim().replace(/\/+$/, '');
    return `${safeBase}/${trimSlashes(relativePath)}`;
  }

  const provider = config.provider || 'github';
  if (provider === 'github') {
    const repository = config.repository;
    const branch = config.branch || 'main';
    const contentPath = config.contentPath || 'content';

    if (!repository) {
      return null;
    }

    const filePath = joinUrlParts(contentPath, relativePath);
    return `https://github.com/${trimSlashes(repository)}/edit/${trimSlashes(branch)}/${filePath}`;
  }

  return null;
}

export default function WikiPage({
  mdxSource,
  title,
  description,
  currentPath,
  sidebarConfig,
  headerConfig,
  searchDocuments,
  siteConfig,
  footerConfig,
  template,
  templateConfig,
  pagePreset,
  editPage,
  pageNavigation,
}) {
  const titleSuffix = siteConfig?.titleSuffix || siteConfig?.siteName || 'MiniWiki';
  const fallbackDescription = siteConfig?.siteDescription || '';
  const faviconPath = normalizeAssetPath(siteConfig?.faviconPath || '/favicon.ico');
  const Template = resolveTemplate(template);

  return (
    <>
      <Head>
        <title>{title ? `${title} | ${titleSuffix}` : titleSuffix}</title>
        {description || fallbackDescription ? (
          <meta name="description" content={description || fallbackDescription} />
        ) : null}
        <link rel="icon" href={faviconPath} />
      </Head>
      <WikiLayout
        currentPath={currentPath}
        sidebarConfig={sidebarConfig}
        headerConfig={headerConfig}
        searchDocuments={searchDocuments}
        siteConfig={siteConfig}
        footerConfig={footerConfig}
        presetOverride={pagePreset}
      >
        <Template title={title} description={description} templateConfig={templateConfig}>
          <MDXRemote {...mdxSource} components={mdxComponents} />

          {pageNavigation?.previous || pageNavigation?.next ? (
            <nav
              className="mt-10 border-t border-slate-200 pt-4 dark:border-slate-800"
              aria-label="Docs page navigation"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                {pageNavigation.previous ? (
                  <Link
                    href={pageNavigation.previous.path}
                    className="group rounded-lg border border-slate-200 px-4 py-3 transition hover:border-blue-300 hover:bg-blue-50/70 dark:border-slate-800 dark:hover:border-blue-600 dark:hover:bg-blue-950/30"
                  >
                    <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      <Icon name="arrowleft" size={14} />
                      <span>Previous</span>
                    </span>
                    <span className="block text-sm font-medium text-slate-900 group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-blue-300">
                      {pageNavigation.previous.title}
                    </span>
                  </Link>
                ) : null}

                {pageNavigation.next ? (
                  <Link
                    href={pageNavigation.next.path}
                    className="group rounded-lg border border-slate-200 px-4 py-3 transition hover:border-blue-300 hover:bg-blue-50/70 dark:border-slate-800 dark:hover:border-blue-600 dark:hover:bg-blue-950/30 sm:ml-auto sm:text-right"
                  >
                    <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:justify-end">
                      <span>Next</span>
                      <Icon name="arrowright" size={14} />
                    </span>
                    <span className="block text-sm font-medium text-slate-900 group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-blue-300">
                      {pageNavigation.next.title}
                    </span>
                  </Link>
                ) : null}
              </div>
            </nav>
          ) : null}

          {editPage?.url ? (
            <div className="mt-10 border-t border-slate-200 pt-4 dark:border-slate-800">
              <a
                href={editPage.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Icon name="pencil" />
                <span>{editPage.text || 'Edit this page'}</span>
              </a>
            </div>
          ) : null}
        </Template>
      </WikiLayout>
    </>
  );
}

export async function getStaticPaths() {
  const routes = getAllRoutes();

  return {
    paths: routes.map((route) => ({
      params: {
        slug: route.slug,
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const slug = params?.slug || [];
  const filePath = getFilePathFromSlugSegments(slug);

  if (!filePath) {
    return {
      notFound: true,
    };
  }

  const source = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(source);
  const relativePath = toPosixPath(path.relative(CONTENT_DIR, filePath));
  const siteConfig = getSiteConfig(relativePath);
  const templatesConfig = getTemplatesConfig(relativePath);
  const pageTemplatesEnabled = siteConfig?.pageTemplates?.enabled !== false;
  const siteDefaultTemplate =
    siteConfig?.defaultTemplate ||
    siteConfig?.pageTemplates?.defaultTemplate ||
    templatesConfig?.defaultTemplate ||
    'default';
  const fallbackTemplate =
    siteDefaultTemplate;
  const templateKey = pageTemplatesEnabled ? data.template || fallbackTemplate : fallbackTemplate;

  const mdxSource = await serialize(content, {
    parseFrontmatter: false,
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'append',
            properties: {
              className: ['miniwiki-heading-anchor'],
              ariaLabel: 'Link to section',
            },
            content: {
              type: 'text',
              value: ' #',
            },
          },
        ],
      ],
    },
  });

  const currentPath = slug.length ? `/${slug.join('/')}` : '/';
  const sidebarConfig = getSidebarConfig(relativePath);
  const editPageUrl = buildEditPageUrl({
    siteConfig,
    relativePath,
    frontmatter: data,
  });
  const pageNavigation = buildPageNavigation({
    sidebarConfig,
    currentPath,
    frontmatter: data,
  });

  return {
    props: {
      mdxSource,
      title: data.title || 'Untitled',
      description: data.description || '',
      currentPath,
      sidebarConfig,
      headerConfig: getHeaderConfig(relativePath),
      footerConfig: getFooterConfig(relativePath),
      searchDocuments: getPageMetaIndex(),
      siteConfig,
      template: templateKey,
      templateConfig: mergeTemplateConfig(
        templateKey,
        data.templateConfig,
        templatesConfig
      ),
      pagePreset: data.wikiPreset || null,
      editPage: {
        url: editPageUrl,
        text: data.editPageText || siteConfig?.editPage?.text || 'Edit this page',
      },
      pageNavigation,
    },
  };
}
