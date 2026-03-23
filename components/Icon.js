import {
  AlertCircle,
  Book,
  CheckCircle2,
  Code2,
  FileCode2,
  FolderGit2,
  Hammer,
  Info,
  Layers3,
  LayoutTemplate,
  Lightbulb,
  Rocket,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Terminal,
  Wrench,
  XCircle,
} from 'lucide-react';

const ICONS = {
  alert: AlertCircle,
  book: Book,
  check: CheckCircle2,
  code: Code2,
  docs: FileCode2,
  git: FolderGit2,
  hammer: Hammer,
  info: Info,
  layers: Layers3,
  template: LayoutTemplate,
  idea: Lightbulb,
  rocket: Rocket,
  search: Search,
  settings: Settings2,
  security: ShieldCheck,
  sparkles: Sparkles,
  terminal: Terminal,
  tool: Wrench,
  error: XCircle,
};

export default function Icon({ name = 'info', size = 18, className = '' }) {
  const ResolvedIcon = ICONS[name] || ICONS.info;
  return <ResolvedIcon size={size} className={className} aria-hidden="true" />;
}
