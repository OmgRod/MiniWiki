export function normalizeAssetPath(assetPath = '') {
  const value = String(assetPath || '').trim();

  if (!value) {
    return '';
  }

  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) {
    return value;
  }

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const normalizedBasePath = basePath.replace(/\/+$/, '');
  const normalizedPath = value.startsWith('/') ? value : `/${value}`;

  if (!normalizedBasePath) {
    return normalizedPath;
  }

  if (normalizedPath.startsWith(`${normalizedBasePath}/`) || normalizedPath === normalizedBasePath) {
    return normalizedPath;
  }

  return `${normalizedBasePath}${normalizedPath}`;
}
