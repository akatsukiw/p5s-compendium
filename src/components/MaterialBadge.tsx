import React from 'react';
import { PERSONA_META } from '../data/personaData';
import type { MaterialItem } from '../types';

export function MaterialBadge({
  material,
  onClick,
  isHighlighted = false,
  compact = false,
}: {
  material: MaterialItem;
  onClick: () => void;
  isHighlighted?: boolean;
  compact?: boolean;
}) {
  const matMeta = PERSONA_META[material.name];
  const baseLvl = material.baseLevel ?? matMeta?.level ?? material.level;
  const reqLvl = material.requiredLevel ?? material.level;
  const isLevelBoosted = reqLvl > baseLvl;

  const tooltip = isLevelBoosted
    ? `合体要求等级: Lv${reqLvl} (需练级 · 初始原始等级: Lv${baseLvl})`
    : `合体等级: Lv${reqLvl} (图鉴初始等级)`;

  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={`inline-flex items-center justify-center transition-all shadow-[1px_1px_0_#000] p5-skew-l group/mat cursor-pointer whitespace-nowrap shrink-0 ${
        compact
          ? 'px-1.5 py-0.5 gap-1'
          : 'px-2 py-0.5 gap-1.5'
      } ${
        isHighlighted
          ? 'bg-[#b8000e] hover:bg-[#e60012] text-white border border-[#ff4d59]/60 shadow-[1px_1px_0_#000]'
          : 'bg-[#0e1017] hover:bg-[#e60012] text-white border border-white/10 hover:border-white/30'
      }`}
    >
      <span
        className={`p5-unskew-l inline-flex items-center leading-normal ${
          compact
            ? 'gap-1 text-[11px] sm:text-xs'
            : 'gap-1.5 text-xs sm:text-[13px]'
        }`}
      >
        {/* Arcana Tag: Generously padded, crisp black-on-white badge per reference screenshot */}
        {matMeta && (
          <span
            className={`inline-flex items-center justify-center px-1.5 py-0.5 text-[9.5px] sm:text-[10px] font-black shrink-0 leading-none shadow-[1px_1px_0_#000] ${
              isHighlighted ? 'bg-black text-white' : 'bg-white text-black'
            }`}
          >
            {matMeta.arcana}
          </span>
        )}

        {/* Persona Name: Toned down slightly to comfortable text-zinc-300 */}
        <span
          className={`font-bold tracking-tight inline-flex items-center ${
            isHighlighted ? 'text-white' : 'text-zinc-300 group-hover/mat:text-white'
          }`}
        >
          {material.name}
        </span>

        {/* Level Tag: LvXX format without dot, muted text-zinc-500 font color with comfortable separation */}
        {isLevelBoosted ? (
          <span
            className={`font-mono font-bold text-[10px] sm:text-[11px] tracking-tight inline-flex items-center ml-0.5 ${
              isHighlighted
                ? 'text-[#ffe57f]'
                : 'text-[#f6c344] group-hover/mat:text-[#fffb00]'
            }`}
            title={`合体要求 Lv${reqLvl} (初始原始等级 Lv${baseLvl})`}
          >
            Lv{reqLvl}<span className="text-[8px] font-bold text-[#ffe57f] ml-0.2">▲</span>
          </span>
        ) : (
          <span
            className={`font-mono font-bold text-[10px] sm:text-[11px] tracking-tight inline-flex items-center ml-0.5 ${
              isHighlighted
                ? 'text-white/90'
                : 'text-zinc-500 group-hover/mat:text-white'
            }`}
          >
            Lv{reqLvl}
          </span>
        )}
      </span>
    </button>
  );
}
