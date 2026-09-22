import React from 'react';
import { PERSONA_META, RECIPES_BY_TARGET, DOWNSTREAM_BY_MATERIAL } from '../data/personaData';
import { ArcanaBadge } from './ArcanaBadge';
import { X, GitBranch, ArrowRight, ExternalLink } from 'lucide-react';

interface Props {
  personaName: string | null;
  onClose: () => void;
  onSelectForTree: (name: string) => void;
}

export const PersonaDetailModal: React.FC<Props> = ({
  personaName,
  onClose,
  onSelectForTree,
}) => {
  if (!personaName) return null;

  const meta = PERSONA_META[personaName] || { arcana: '未知', level: 0 };
  const upRecipes = RECIPES_BY_TARGET[personaName] || [];
  const downRecipes = DOWNSTREAM_BY_MATERIAL[personaName] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-[#121218] border-2 border-[#e60012] p-6 shadow-[10px_10px_0_#000] p5-clip-corner max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-[#e60012] border border-zinc-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header in P5 Style */}
        <div className="border-b-2 border-zinc-800 pb-4 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <ArcanaBadge arcana={meta.arcana} size="md" />
            <span className="bg-black text-amber-400 font-mono font-bold text-xs px-2 py-0.5 border border-zinc-800">
              Lv.{meta.level}
            </span>
          </div>
          <h2 className="text-3xl font-black italic text-white tracking-wider">
            {personaName}
          </h2>
          <div className="mt-2 flex items-center gap-3">
            <button
              onClick={() => {
                onSelectForTree(personaName);
                onClose();
              }}
              className="px-3 py-1.5 bg-[#e60012] hover:bg-red-600 text-white text-xs font-black p5-skew-l flex items-center gap-1.5 shadow-[2px_2px_0_#000]"
            >
              <span className="p5-unskew-l flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5" />
                设为当前树状图视角
              </span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto space-y-5 flex-1 pr-1">
          
          {/* Section: How to synthesize (Upstream) */}
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-1.5 h-3 bg-[#e60012]" />
              如何合成 {personaName} ({upRecipes.length}条公式)
            </h3>
            {upRecipes.length === 0 ? (
              <p className="text-xs text-zinc-500 italic">暂无收录的合成路线</p>
            ) : (
              <div className="space-y-1.5">
                {upRecipes.map((r, i) => (
                  <div
                    key={i}
                    className="p-2 bg-black/50 border border-zinc-800 text-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {r.materials.map((m, mi) => (
                        <React.Fragment key={mi}>
                          {mi > 0 && <span className="text-[#e60012] font-black">×</span>}
                          <button
                            onClick={() => onSelectForTree(m.name)}
                            className="text-zinc-200 hover:text-amber-300 font-bold"
                          >
                            {m.name} Lv{m.level}
                          </button>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Downstream */}
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-1.5 h-3 bg-[#e60012]" />
              可作为原料合成的新面具 ({downRecipes.length}条路线)
            </h3>
            {downRecipes.length === 0 ? (
              <p className="text-xs text-zinc-500 italic">暂无下游合成记录</p>
            ) : (
              <div className="space-y-2">
                {downRecipes.slice(0, 15).map((r, i) => {
                  const tMeta = PERSONA_META[r.name];
                  return (
                    <div
                      key={i}
                      className="p-2 bg-black/50 border border-zinc-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <button
                        onClick={() => {
                          onSelectForTree(r.name);
                          onClose();
                        }}
                        className="font-black text-white hover:text-[#e60012] text-left flex items-center gap-1.5"
                      >
                        {tMeta && <ArcanaBadge arcana={tMeta.arcana} size="sm" skew={false} />}
                        <span>{r.name}</span>
                        <span className="font-mono text-zinc-400 text-[11px]">Lv.{tMeta?.level}</span>
                      </button>
                      
                      {/* Materials */}
                      <div className="flex items-center gap-1 flex-wrap text-[11px] text-zinc-400">
                        <span>需要:</span>
                        {r.materials.map((m, mIdx) => (
                          <React.Fragment key={mIdx}>
                            {mIdx > 0 && <span className="text-[#e60012] font-black">+</span>}
                            <span className={m.name === personaName ? 'text-white font-bold' : 'text-zinc-300'}>
                              {m.name} Lv{m.level}
                            </span>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
