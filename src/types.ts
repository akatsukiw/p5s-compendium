export interface MaterialItem {
  name: string;
  level: number;
  requiredLevel: number;
  baseLevel: number;
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
}

export type PersonaMetaMap = Record<string, PersonaMeta>;
