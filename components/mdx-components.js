import Alert from './Alert';
import Accordion from './Accordion';
import Badge from './Badge';
import ButtonLink from './ButtonLink';
import Callout from './Callout';
import Card from './Card';
import CardGrid from './CardGrid';
import CodeBlock from './CodeBlock';
import Divider from './Divider';
import FeatureList from './FeatureList';
import Icon from './Icon';
import Kbd from './Kbd';
import Steps from './Steps';
import Tabs, { TabPanels } from './Tabs';

const mdxComponents = {
  Accordion,
  Alert,
  Badge,
  ButtonLink,
  Callout,
  Card,
  CardGrid,
  CodeBlock,
  Divider,
  FeatureList,
  Icon,
  Kbd,
  Steps,
  Tabs,
  TabPanels,
  pre: (props) => <CodeBlock {...props} />,
};

export default mdxComponents;
