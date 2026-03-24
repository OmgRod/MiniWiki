import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Head from 'next/head';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import WikiLayout from '../layouts/WikiLayout';
import mdxComponents from '../components/mdx-components';
import { mergeTemplateConfig, resolveTemplate } from '../templates';

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
}) {
  const titleSuffix = siteConfig?.titleSuffix || siteConfig?.siteName || 'MiniWiki';
  const fallbackDescription = siteConfig?.siteDescription || '';
  const Template = resolveTemplate(template);

  return (
    <>
      <Head>
        <title>{title ? `${title} | ${titleSuffix}` : titleSuffix}</title>
        {description || fallbackDescription ? (
          <meta name="description" content={description || fallbackDescription} />
        ) : null}
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

          {editPage?.url ? (
            <div className="mt-10 border-t border-slate-200 pt-4 dark:border-slate-800">
              <a
                href={editPage.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {editPage.text || 'Edit this page'}
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
  const siteConfig = getSiteConfig();
  const templatesConfig = getTemplatesConfig();
  const pageTemplatesEnabled = siteConfig?.pageTemplates?.enabled !== false;
  const fallbackTemplate =
    siteConfig?.pageTemplates?.defaultTemplate || templatesConfig?.defaultTemplate || 'default';
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
  const editPageUrl = buildEditPageUrl({
    siteConfig,
    relativePath,
    frontmatter: data,
  });

  return {
    props: {
      mdxSource,
      title: data.title || 'Untitled',
      description: data.description || '',
      currentPath,
      sidebarConfig: getSidebarConfig(),
      headerConfig: getHeaderConfig(),
      footerConfig: getFooterConfig(),
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
    },
  };
}
