import rawMeta from './rawPersonaData.json';
import rawRecipes from './rawRecipes.json';
import { FusionRow, PersonaMetaMap } from '../types';

export const ARCANA_ORDER: string[] = rawMeta.arcanaOrder;
export const PERSONA_META: PersonaMetaMap = rawMeta.meta;

export const FUSION_ROWS: FusionRow[] = (rawRecipes as any[]).map((r, index) => ({
  ...r,
  id: `${r.name}|${r.text}|${index}`,
}));

export const ALL_PERSONA_NAMES: string[] = Object.keys(PERSONA_META).sort(
  (a, b) => PERSONA_META[a].level - PERSONA_META[b].level || a.localeCompare(b, 'zh')
);
