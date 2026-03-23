import DocsPreset from './DocsPreset';
import MinimalPreset from './MinimalPreset';
import PortalPreset from './PortalPreset';

const PRESETS = {
  docs: DocsPreset,
  minimal: MinimalPreset,
  portal: PortalPreset,
};

export function resolveWikiPreset(presetKey) {
  if (!presetKey) {
    return DocsPreset;
  }

  return PRESETS[presetKey] || DocsPreset;
}

export function getWikiPresetKeys() {
  return Object.keys(PRESETS);
}
