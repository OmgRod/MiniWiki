import DefaultTemplate from './DefaultTemplate';
import GuideTemplate from './GuideTemplate';
import LandingTemplate from './LandingTemplate';
import ReferenceTemplate from './ReferenceTemplate';

const TEMPLATE_COMPONENTS = {
  default: DefaultTemplate,
  guide: GuideTemplate,
  landing: LandingTemplate,
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
