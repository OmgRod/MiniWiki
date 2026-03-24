import AuraTemplate from './AuraTemplate';
import DefaultTemplate from './DefaultTemplate';
import ForestTemplate from './ForestTemplate';
import GuideTemplate from './GuideTemplate';
import LandingTemplate from './LandingTemplate';
import MidnightTemplate from './MidnightTemplate';
import ReferenceTemplate from './ReferenceTemplate';

const TEMPLATE_COMPONENTS = {
  aura: AuraTemplate,
  default: DefaultTemplate,
  forest: ForestTemplate,
  guide: GuideTemplate,
  landing: LandingTemplate,
  midnight: MidnightTemplate,
  reference: ReferenceTemplate,
};

export function resolveTemplate(templateKey) {
  if (!templateKey) {
    return DefaultTemplate;
  }

  return TEMPLATE_COMPONENTS[templateKey] || DefaultTemplate;
}

export function mergeTemplateConfig(templateKey, pageTemplateConfig, templatesConfig) {
  const defaultTemplateConfig = templatesConfig?.defaults?.[templateKey] || {};
  return {
    ...defaultTemplateConfig,
    ...(pageTemplateConfig || {}),
  };
}

export function getTemplateKeys() {
  return Object.keys(TEMPLATE_COMPONENTS);
}
