import React, { useState, useMemo } from 'react';
import { ALL_PERSONA_NAMES, PERSONA_META, FUSION_ROWS } from '../data/personaData';
import { ArcanaBadge } from './ArcanaBadge';
import { Sparkles, ArrowRight, CheckCircle2, Search, ExternalLink } from 'lucide-react';

interface Props {
  onSelectPersonaForTree: (name: string) => void;
}

export const SynthesisCalculator: React.FC<Props> = ({ onSelectPersonaForTree }) => {
  const [personaA, setPersonaA] = useState('软泥怪');
  const [personaB, setPersonaB] = useState('女梦魔');

  // Find if there's any recipe where materials contain both personaA and personaB
  const fusionResults = useMemo(() => {
    if (!personaA || !personaB) return [];
    return FUSION_ROWS.filter((row) => {
      const names = row.materials.map((m) => m.name);
      return names.includes(personaA) && names.includes(personaB);
    });
  }, [personaA, personaB]);

  const metaA = PERSONA_META[personaA];
  const metaB = PERSONA_META[personaB];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-[#121218] border-2 border-zinc-700 p-5 p5-clip-corner shadow-[6px_6px_0_#000]">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-[#e60012] text-white text-xs font-black px-2 py-0.5 p5-skew-l">
            <span className="p5-unskew-l">VELVET ROOM FUSION</span>
          </span>
          <h2 className="text-2xl font-black italic tracking-wide text-white">
            双向合体速查模拟器
          </h2>
        </div>
        <p className="text-xs text-zinc-400">
          任意选择手头的两个面具，实时查询它们能合成出的新面具结果；或点击跳转至该结果的合成树。
        </p>
      </div>

      {/* Inputs */}
      <div className="bg-[#15151e] border-2 border-zinc-800 p-6 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          
          {/* Persona A */}
          <div className="md:col-span-5 space-y-2">
            <label className="text-xs font-black text-zinc-300 uppercase tracking-wider flex items-center justify-between">
              <span>面具材料 A (Persona 1)</span>
              {metaA && <ArcanaBadge arcana={metaA.arcana} />}
            </label>
            <select
              value={personaA}
              onChange={(e) => setPersonaA(e.target.value)}
              className="w-full bg-[#0a0a0d] text-white p-3 text-sm font-bold border-2 border-zinc-700 focus:border-[#e60012] focus:outline-none"
            >
              {ALL_PERSONA_NAMES.map((name) => (
                <option key={name} value={name}>
                  Lv.{PERSONA_META[name].level} {name} ({PERSONA_META[name].arcana})
                </option>
              ))}
            </select>
          </div>

          {/* Fusion Symbol */}
          <div className="md:col-span-1 text-center font-black text-2xl text-[#e60012]">
            ×
          </div>

          {/* Persona B */}
          <div className="md:col-span-5 space-y-2">
            <label className="text-xs font-black text-zinc-300 uppercase tracking-wider flex items-center justify-between">
              <span>面具材料 B (Persona 2)</span>
              {metaB && <ArcanaBadge arcana={metaB.arcana} />}
            </label>
            <select
              value={personaB}
              onChange={(e) => setPersonaB(e.target.value)}
              className="w-full bg-[#0a0a0d] text-white p-3 text-sm font-bold border-2 border-zinc-700 focus:border-[#e60012] focus:outline-none"
            >
              {ALL_PERSONA_NAMES.map((name) => (
                <option key={name} value={name}>
                  Lv.{PERSONA_META[name].level} {name} ({PERSONA_META[name].arcana})
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Results Area */}
        <div className="mt-8 pt-6 border-t-2 border-zinc-800">
          <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            合成推演结果 (Fusion Output)
          </h3>

          {fusionResults.length === 0 ? (
            <div className="p-8 text-center bg-black/40 border border-zinc-800 text-zinc-400 text-sm">
              <div className="text-amber-400 font-bold mb-1">未收录该特定两体组合的直接合成记录</div>
              <p className="text-xs text-zinc-500">
                提示：某些高级面具需要 3 体或特定特殊公式合成，或者可尝试在「全合体数据表」中按塔罗牌查阅。
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {fusionResults.map((r) => {
                const resMeta = PERSONA_META[r.name] || { arcana: r.arcana, level: r.level };
                return (
                  <div
                    key={r.id}
                    className="bg-[#1d1d28] border-2 border-[#e60012] p-5 shadow-[4px_4px_0_#000] p5-skew-l relative"
                  >
                    <div className="p5-unskew-l space-y-3">
                      <div className="flex items-center justify-between">
                        <ArcanaBadge arcana={resMeta.arcana} />
                        <span className="font-mono font-black text-amber-300 text-xs">
                          Lv.{resMeta.level}
                        </span>
                      </div>
                      <div className="text-2xl font-black italic text-white tracking-wide">
                        {r.name}
                      </div>
                      <div className="text-xs text-zinc-400">
                        合体需求材料数: {r.materials.length} 体
                      </div>
                      <button
                        onClick={() => onSelectPersonaForTree(r.name)}
                        className="w-full py-2 bg-[#e60012] hover:bg-red-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-[2px_2px_0_#000]"
                      >
                        查看该面具完整树状图
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
