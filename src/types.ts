export interface MaterialItem {
  name: string;
  level: number;
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
