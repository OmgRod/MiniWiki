import fs from 'fs';
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
      >
        <Template title={title} description={description} templateConfig={templateConfig}>
          <MDXRemote {...mdxSource} components={mdxComponents} />
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
    },
  };
}
