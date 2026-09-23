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
    ? `合体要求等级: Lv.${reqLvl} (需练级 · 初始原始等级: Lv.${baseLvl})`
    : `合体等级: Lv.${reqLvl} (图鉴初始等级)`;

  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={`inline-flex items-center transition-all shadow-[1px_1px_0_#000] p5-skew-l group/mat cursor-pointer whitespace-nowrap shrink-0 ${
        compact ? 'px-1 py-0.5 gap-0.5' : 'px-1.5 py-0.5 gap-1'
      } ${
        isHighlighted
          ? 'bg-[#b8000e] hover:bg-[#e60012] text-white border border-[#ff4d59]/50 shadow-[1px_1px_0_#000]'
          : 'bg-[#0f0f15] hover:bg-[#e60012] text-white border border-white/10'
      }`}
    >
      <span className={`p5-unskew-l flex items-center leading-none ${compact ? 'gap-0.5 text-[11px] sm:text-[13px]' : 'gap-1 text-xs sm:text-[14px]'}`}>
        {/* Arcana Tag */}
        {matMeta && (
          <span
            className={`px-0.5 sm:px-1 py-0 text-[9px] sm:text-[10.5px] font-bold shrink-0 leading-tight ${
              isHighlighted ? 'bg-black text-white' : 'bg-white text-black'
            }`}
          >
            {matMeta.arcana}
          </span>
        )}

        {/* Persona Name */}
        <span
          className={`font-bold tracking-tight ${
            isHighlighted ? 'text-white' : 'text-zinc-100 group-hover/mat:text-white'
          }`}
        >
          {material.name}
        </span>

        {/* Level Tag: Refined and unified style */}
        {isLevelBoosted ? (
          <span
            className={`font-mono font-bold text-[10.5px] sm:text-xs tracking-tighter ${
              isHighlighted
                ? 'text-[#ffe57f]'
                : 'text-[#f6c344] group-hover/mat:text-[#fffb00]'
            }`}
            title={`合体要求 Lv.${reqLvl} (初始原始等级 Lv.${baseLvl})`}
          >
            Lv{reqLvl}<span className="text-[9.5px] font-bold text-[#ffe57f] ml-0.2">▲</span>
          </span>
        ) : (
          <span
            className={`font-mono font-bold text-[10.5px] sm:text-xs tracking-tight ${
              isHighlighted
                ? 'text-white/90'
                : 'text-[#e60012] group-hover/mat:text-white'
            }`}
          >
            Lv{reqLvl}
          </span>
        )}
      </span>
    </button>
  );
}
