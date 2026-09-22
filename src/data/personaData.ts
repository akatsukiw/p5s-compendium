import rawMeta from './rawPersonaData.json';
import rawRecipes from './rawRecipes.json';
import { FusionRow, PersonaMetaMap } from '../types';

export const ARCANA_ORDER: string[] = rawMeta.arcanaOrder;
export const PERSONA_META: PersonaMetaMap = rawMeta.meta;

export const ARCANA_COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  "愚者": { bg: "bg-[#2c3e50]", text: "text-sky-200", border: "border-sky-600" },
  "魔术师": { bg: "bg-[#c0392b]", text: "text-amber-100", border: "border-red-500" },
  "女教皇": { bg: "bg-[#16a085]", text: "text-emerald-100", border: "border-teal-400" },
  "女皇": { bg: "bg-[#8e44ad]", text: "text-purple-100", border: "border-purple-400" },
  "皇帝": { bg: "bg-[#2980b9]", text: "text-blue-100", border: "border-blue-400" },
  "教皇": { bg: "bg-[#7f8c8d]", text: "text-gray-100", border: "border-zinc-400" },
  "恋爱": { bg: "bg-[#e84393]", text: "text-pink-100", border: "border-pink-400" },
  "战车": { bg: "bg-[#d63031]", text: "text-rose-100", border: "border-rose-500" },
  "正义": { bg: "bg-[#00cec9]", text: "text-cyan-950", border: "border-cyan-300" },
  "隐士": { bg: "bg-[#4b6584]", text: "text-indigo-100", border: "border-indigo-400" },
  "命运": { bg: "bg-[#6c5ce7]", text: "text-violet-100", border: "border-violet-400" },
  "力量": { bg: "bg-[#fd79a8]", text: "text-pink-950", border: "border-pink-300" },
  "倒悬者": { bg: "bg-[#e17055]", text: "text-amber-100", border: "border-amber-500" },
  "死神": { bg: "bg-[#1e272e]", text: "text-red-300", border: "border-red-800" },
  "节制": { bg: "bg-[#10ac84]", text: "text-emerald-100", border: "border-emerald-400" },
  "恶魔": { bg: "bg-[#3d3d3d]", text: "text-purple-300", border: "border-purple-700" },
  "塔": { bg: "bg-[#962d22]", text: "text-red-100", border: "border-red-600" },
  "星星": { bg: "bg-[#f39c12]", text: "text-amber-950", border: "border-amber-300" },
  "月亮": { bg: "bg-[#575fcf]", text: "text-indigo-100", border: "border-indigo-400" },
  "太阳": { bg: "bg-[#f1c40f]", text: "text-yellow-950", border: "border-yellow-400" },
  "审判": { bg: "bg-[#718093]", text: "text-slate-100", border: "border-slate-400" },
};

export const FUSION_ROWS: FusionRow[] = (rawRecipes as any[]).map((r, index) => ({
  ...r,
  id: `${r.name}|${r.text}|${index}`,
}));

// Precomputed lookups for instant navigation
export const RECIPES_BY_TARGET: Record<string, FusionRow[]> = {};
export const DOWNSTREAM_BY_MATERIAL: Record<string, FusionRow[]> = {};

for (const row of FUSION_ROWS) {
  if (!RECIPES_BY_TARGET[row.name]) {
    RECIPES_BY_TARGET[row.name] = [];
  }
  RECIPES_BY_TARGET[row.name].push(row);

  for (const mat of row.materials) {
    if (!DOWNSTREAM_BY_MATERIAL[mat.name]) {
      DOWNSTREAM_BY_MATERIAL[mat.name] = [];
    }
    DOWNSTREAM_BY_MATERIAL[mat.name].push(row);
  }
}

export const ALL_PERSONA_NAMES: string[] = Object.keys(PERSONA_META).sort(
  (a, b) => PERSONA_META[a].level - PERSONA_META[b].level || a.localeCompare(b, 'zh')
);
