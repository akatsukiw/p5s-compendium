export interface MaterialItem {
  name: string;
  level: number; // 配方合体要求等级 (backward compatible)
  requiredLevel: number; // 合体要求等级 (e.g. 51)
  baseLevel: number; // 图鉴基础等级 (e.g. 4)
}

export interface FusionRow {
  id: string;
  arcana: string;
  level: number;
  name: string;
  materials: MaterialItem[];
  text: string;
}

export interface PersonaMeta {
  arcana: string;
  level: number;
  element?: string; // Optional primary affinity
  lore?: string;
}

export type PersonaMetaMap = Record<string, PersonaMeta>;

export interface FusionData {
  rows: FusionRow[];
  meta: PersonaMetaMap;
  arcanaOrder: string[];
  arcanaColors: string[];
}
