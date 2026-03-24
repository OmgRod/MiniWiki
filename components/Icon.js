import * as LucideIcons from 'lucide-react';

const ICON_ALIASES = {
  alert: 'AlertCircle',
  archive: 'Archive',
  arrowdown: 'ArrowDown',
  arrowleft: 'ArrowLeft',
  arrowright: 'ArrowRight',
  arrowup: 'ArrowUp',
  bell: 'Bell',
  book: 'Book',
  bookmark: 'Bookmark',
  calendar: 'Calendar',
  camera: 'Camera',
  chat: 'MessageCircle',
  check: 'CheckCircle2',
  chevrondown: 'ChevronDown',
  chevronleft: 'ChevronLeft',
  chevronright: 'ChevronRight',
  chevronup: 'ChevronUp',
  clock: 'Clock3',
  close: 'X',
  code: 'Code2',
  copy: 'Copy',
  dashboard: 'LayoutDashboard',
  danger: 'TriangleAlert',
  delete: 'Trash2',
  docs: 'FileCode2',
  download: 'Download',
  edit: 'Pencil',
  email: 'Mail',
  error: 'XCircle',
  external: 'ExternalLink',
  file: 'File',
  folder: 'Folder',
  gear: 'Settings2',
  git: 'FolderGit2',
  github: 'Github',
  globe: 'Globe',
  hammer: 'Hammer',
  heart: 'Heart',
  help: 'CircleHelp',
  home: 'Home',
  image: 'Image',
  info: 'Info',
  idea: 'Lightbulb',
  layers: 'Layers3',
  link: 'Link',
  linkedin: 'Linkedin',
  lock: 'Lock',
  menu: 'Menu',
  note: 'NotebookPen',
  notification: 'Bell',
  pencil: 'Pencil',
  phone: 'Phone',
  plus: 'Plus',
  question: 'CircleHelp',
  rocket: 'Rocket',
  search: 'Search',
  security: 'ShieldCheck',
  settings: 'Settings2',
  sparkles: 'Sparkles',
  star: 'Star',
  success: 'CheckCircle2',
  tag: 'Tag',
  terminal: 'Terminal',
  template: 'LayoutTemplate',
  tool: 'Wrench',
  trash: 'Trash2',
  twitter: 'Twitter',
  upload: 'Upload',
  user: 'User',
  users: 'Users',
  video: 'Video',
  warning: 'TriangleAlert',
  wrench: 'Wrench',
  x: 'X',
  youtube: 'Youtube',
};

function toPascalCase(value = '') {
  return String(value)
    .trim()
    .replace(/[_\-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

function isIconComponent(value) {
  return (typeof value === 'function' || typeof value === 'object') && value !== null;
}

function resolveIcon(name = 'info') {
  const rawName = String(name || '').trim();
  const lowerName = rawName.toLowerCase();

  const aliasName = ICON_ALIASES[lowerName];
  if (aliasName && isIconComponent(LucideIcons[aliasName])) {
    return LucideIcons[aliasName];
  }

  if (isIconComponent(LucideIcons[rawName])) {
    return LucideIcons[rawName];
  }

  const pascalName = toPascalCase(rawName);
  if (isIconComponent(LucideIcons[pascalName])) {
    return LucideIcons[pascalName];
  }

  return LucideIcons.Info;
}

export default function Icon({ name = 'info', size = 18, className = '' }) {
  const ResolvedIcon = resolveIcon(name);
  return <ResolvedIcon size={size} className={className} aria-hidden="true" />;
}
