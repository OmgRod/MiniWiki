const fs = require('node:fs');

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const repository = process.env.GITHUB_REPOSITORY || '';
const repoName = repository.split('/')[1] || '';
const hasCustomDomain = fs.existsSync('./CNAME');

const repoBasePath = !hasCustomDomain && repoName ? `/${repoName}` : '';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubActions ? repoBasePath : '',
  },
  images: {
    unoptimized: true,
  },
  basePath: isGithubActions ? repoBasePath : '',
  assetPrefix: isGithubActions && repoBasePath ? `${repoBasePath}/` : undefined,
};

module.exports = nextConfig;
