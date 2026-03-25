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
import Tabs, { Tab, TabPanels } from './Tabs';
import Table, { Caption, TBody, TD, TH, THead, TR } from './WikiTable';
import {
  AreaChart,
  BarChart,
  DonutChart,
  HeatmapChart,
  ProgressRingChart,
  SparklineChart,
  StackedBarChart,
} from './charts';
import { FormulaList, MathEquation, MathSteps, UnitConverter } from './math';
import { CompoundBreakdown, ElementCard, PeriodicTable } from './science';
import { Flashcards, Poll, Quiz } from './interactive';

const mdxComponents = {
  Accordion,
  Alert,
  AreaChart,
  Badge,
  BarChart,
  ButtonLink,
  Callout,
  Card,
  CardGrid,
  Caption,
  CodeBlock,
  CompoundBreakdown,
  DarkModeToggle,
  DefinitionList,
  Divider,
  DonutChart,
  ElementCard,
  Flashcards,
  FormulaList,
  FeatureList,
  Figure,
  Footer,
  Header,
  HeatmapChart,
  Icon,
  Infobox,
  Kbd,
  MathEquation,
  MathSteps,
  PeriodicTable,
  Poll,
  ProgressRingChart,
  PresetSearch,
  Quiz,
  SearchBar,
  Sidebar,
  SparklineChart,
  StackedBarChart,
  Steps,
  UnitConverter,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Tabs,
  Tab,
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
