import Alert from './Alert';
import Accordion from './Accordion';
import Badge from './Badge';
import ButtonLink from './ButtonLink';
import Callout from './Callout';
import Card from './Card';
import CardGrid from './CardGrid';
import CodeBlock from './CodeBlock';
import DarkModeToggle from './DarkModeToggle';
import Divider from './Divider';
import DefinitionList from './DefinitionList';
import FeatureList from './FeatureList';
import Figure from './Figure';
import Footer from './Footer';
import Header from './Header';
import Infobox from './Infobox';
import Icon from './Icon';
import Kbd from './Kbd';
import PresetSearch from './PresetSearch';
import SearchBar from './SearchBar';
import Sidebar from './Sidebar';
import Steps from './Steps';
import Tabs, { TabPanels } from './Tabs';
import Table, { Caption, TBody, TD, TH, THead, TR } from './WikiTable';

const mdxComponents = {
  Accordion,
  Alert,
  Badge,
  ButtonLink,
  Callout,
  Card,
  CardGrid,
  Caption,
  CodeBlock,
  DarkModeToggle,
  DefinitionList,
  Divider,
  FeatureList,
  Figure,
  Footer,
  Header,
  Icon,
  Infobox,
  Kbd,
  PresetSearch,
  SearchBar,
  Sidebar,
  Steps,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Tabs,
  TabPanels,
  caption: (props) => <Caption {...props} />,
  pre: (props) => <CodeBlock {...props} />,
  table: (props) => <Table {...props} />,
  tbody: (props) => <TBody {...props} />,
  td: (props) => <TD {...props} />,
  th: (props) => <TH {...props} />,
  thead: (props) => <THead {...props} />,
  tr: (props) => <TR {...props} />,
};

export default mdxComponents;
