import React, { useState, useMemo, useEffect } from 'react';
import {
  GitMerge,
  ArrowRight,
  Sparkles,
  Zap,
  RotateCcw,
  Check,
  Copy,
  Info,
  Clock,
  Layers,
  ChevronRight,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';
import { ALL_PERSONA_NAMES, PERSONA_META } from '../data/personaData';
import { findFusionPath, FusionPathResult } from '../utils/pathFinder';
import { MaterialBadge } from './MaterialBadge';

interface PathFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFrom?: string;
  initialTo?: string;
  onSelectPersona: (name: string) => void;
}

export function PathFinderModal({
  isOpen,
  onClose,
  initialFrom,
  initialTo,
  onSelectPersona,
}: PathFinderModalProps) {
  // Sort personas by level ascending (Lv.1 -> Lv.83) as requested
  const sortedPersonas = useMemo(() => {
    return [...ALL_PERSONA_NAMES].sort((a, b) => {
      const la = PERSONA_META[a]?.level ?? 0;
      const lb = PERSONA_META[b]?.level ?? 0;
      return la - lb || a.localeCompare(b, 'zh');
    });
  }, []);

  const [fromPersona, setFromPersona] = useState<string>(initialFrom || '杰克灯笼');
  const [toPersona, setToPersona] = useState<string>(initialTo || '杰克霜精');
  const [strategy, setStrategy] = useState<'bfs' | 'all'>('all');
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [resultPaths, setResultPaths] = useState<FusionPathResult[]>([]);
  const [calcStats, setCalcStats] = useState<{ durationMs: number; nodeCount: number; edgeCount: number }>({
    durationMs: 0,
    nodeCount: 0,
    edgeCount: 0,
  });
  const [copiedPathIndex, setCopiedPathIndex] = useState<number | null>(null);

  // Sync initial props
  useEffect(() => {
    if (initialFrom) setFromPersona(initialFrom);
    if (initialTo) setToPersona(initialTo);
  }, [initialFrom, initialTo]);

  // Execute calculation
  const handleCalculate = () => {
    const res = findFusionPath(fromPersona, toPersona, strategy, 4);
    setResultPaths(res.paths);
    setCalcStats({
      durationMs: res.durationMs,
      nodeCount: res.nodeCount,
      edgeCount: res.edgeCount,
    });
    setHasCalculated(true);
  };

  // Run calculation immediately upon opening if initial parameters exist
  useEffect(() => {
    if (isOpen && fromPersona && toPersona && fromPersona !== toPersona) {
      handleCalculate();
    }
  }, [isOpen]);

  const handleSwap = () => {
    const temp = fromPersona;
    setFromPersona(toPersona);
    setToPersona(temp);
  };

  const handleCopyPath = (path: FusionPathResult, index: number) => {
    const text = path.steps
      .map(
        (s, idx) =>
          `第${idx + 1}步: ${s.from.name} + ${s.otherMaterials.map(m => m.name).join(' + ')} ➔ ${s.target}`
      )
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedPathIndex(index);
    setTimeout(() => setCopiedPathIndex(null), 1500);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#0e0e14] border-2 border-[#e60012] w-full max-w-5xl max-h-[92vh] flex flex-col shadow-[0_0_35px_rgba(230,0,18,0.45)] text-white relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Ribbon */}
        <div className="h-1.5 bg-gradient-to-r from-[#e60012] via-white to-[#e60012] shrink-0" />

        {/* Modal Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 bg-[#14141c] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#e60012] text-white flex items-center justify-center p5-skew-l shadow-[2px_2px_0_#000]">
              <GitMerge className="w-5 h-5 sm:w-6 sm:h-6 p5-unskew-l" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-black italic tracking-wide text-white uppercase">
                  天鹅绒房间 · <span className="text-[#e60012]">合成路径寻路器</span>
                </h2>
                <span className="hidden xs:inline-block bg-white text-black font-mono text-[10px] font-black px-1.5 py-0.5 p5-skew-l">
                  <span className="p5-unskew-l">BFS 算法</span>
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-bold mt-0.5">
                基于图论超图拓扑，一键推导从任意起点面具到目标面具的最短降级/合成链条
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 bg-black hover:bg-[#e60012] text-zinc-300 hover:text-white border border-white/10 flex items-center justify-center p5-skew-l transition-colors cursor-pointer shadow-[2px_2px_0_#000] active:scale-95"
            title="关闭窗口"
          >
            <span className="p5-unskew-l font-black text-sm">✕</span>
          </button>
        </div>

        {/* Modal Body: Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-5 custom-scrollbar">
          
          {/* Main Grid: Control Panel (Left) & Results (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            
            {/* Left Controls: Parameters */}
            <div className="lg:col-span-5 bg-[#14141d] border border-white/10 p-4 sm:p-5 shadow-[4px_4px_0_#000] flex flex-col space-y-4 self-start">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-[#e60012] p5-skew-l inline-block" />
                    <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                      参数设置
                    </span>
                    <span className="bg-black text-[#e60012] font-mono text-[10px] font-bold px-1.5 py-0.5 border border-white/10">
                      全书 67 款面具
                    </span>
                  </div>
                  <button
                    onClick={handleSwap}
                    className="text-[11px] font-bold text-zinc-400 hover:text-white flex items-center gap-1 bg-black px-2 py-0.5 border border-white/10 p5-skew-l hover:border-[#e60012] transition-colors cursor-pointer"
                    title="对调起点与目标"
                  >
                    <span className="p5-unskew-l flex items-center gap-1">
                      <RotateCcw className="w-3 h-3 text-[#e60012]" />
                      对调面具
                    </span>
                  </button>
                </div>

                <div className="space-y-3.5">
                  {/* From Persona */}
                  <div className="bg-[#0b0b10] border border-white/10 p-2.5 shadow-[2px_2px_0_#000]">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-[#e60012] text-white text-[9px] font-black font-mono px-1 py-0.2 p5-skew-l">
                          <span className="p5-unskew-l">START</span>
                        </span>
                        <label className="text-xs font-black tracking-wide text-white uppercase">
                          起点面具 (FROM)
                        </label>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono font-bold">
                        Lv.升序 · 共 {sortedPersonas.length} 款
                      </span>
                    </div>

                    <div className="relative">
                      <select
                        value={fromPersona}
                        onChange={(e) => setFromPersona(e.target.value)}
                        className="w-full bg-[#181822] text-white border-2 border-white/20 hover:border-[#e60012] focus:border-[#e60012] pl-3 pr-8 py-2 text-xs sm:text-sm font-black shadow-[2px_2px_0_#000] focus:outline-none transition-colors cursor-pointer appearance-none"
                      >
                        {sortedPersonas.map((name) => {
                          const meta = PERSONA_META[name];
                          return (
                            <option key={`from-${name}`} value={name} className="bg-[#121217] text-white py-1">
                              [Lv.{meta?.level} {meta?.arcana}] {name}
                            </option>
                          );
                        })}
                      </select>
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                        <ChevronDown className="w-4 h-4 text-[#e60012]" />
                      </div>
                    </div>

                    {/* Selected Active Persona Quick Preview Badge */}
                    {PERSONA_META[fromPersona] && (
                      <div className="mt-2 flex items-center justify-between bg-black/60 px-2 py-1 border border-white/5">
                        <span className="text-[10px] text-zinc-400 font-bold">当前选择:</span>
                        <div className="flex items-center gap-1">
                          <span className="bg-white text-black text-[9px] font-black px-1 py-0 font-mono">
                            {PERSONA_META[fromPersona].arcana}
                          </span>
                          <span className="text-xs font-black text-white">{fromPersona}</span>
                          <span className="text-[#f6c344] font-mono font-bold text-[10px]">
                            Lv.{PERSONA_META[fromPersona].level}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* To Persona */}
                  <div className="bg-[#0b0b10] border border-white/10 p-2.5 shadow-[2px_2px_0_#000]">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-white text-black text-[9px] font-black font-mono px-1 py-0.2 p5-skew-l">
                          <span className="p5-unskew-l">GOAL</span>
                        </span>
                        <label className="text-xs font-black tracking-wide text-white uppercase">
                          目标面具 (TO)
                        </label>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono font-bold">
                        Lv.升序 · 共 {sortedPersonas.length} 款
                      </span>
                    </div>

                    <div className="relative">
                      <select
                        value={toPersona}
                        onChange={(e) => setToPersona(e.target.value)}
                        className="w-full bg-[#181822] text-white border-2 border-white/20 hover:border-[#e60012] focus:border-[#e60012] pl-3 pr-8 py-2 text-xs sm:text-sm font-black shadow-[2px_2px_0_#000] focus:outline-none transition-colors cursor-pointer appearance-none"
                      >
                        {sortedPersonas.map((name) => {
                          const meta = PERSONA_META[name];
                          return (
                            <option key={`to-${name}`} value={name} className="bg-[#121217] text-white py-1">
                              [Lv.{meta?.level} {meta?.arcana}] {name}
                            </option>
                          );
                        })}
                      </select>
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                        <ChevronDown className="w-4 h-4 text-[#e60012]" />
                      </div>
                    </div>

                    {/* Selected Active Persona Quick Preview Badge */}
                    {PERSONA_META[toPersona] && (
                      <div className="mt-2 flex items-center justify-between bg-black/60 px-2 py-1 border border-white/5">
                        <span className="text-[10px] text-zinc-400 font-bold">目标结果:</span>
                        <div className="flex items-center gap-1">
                          <span className="bg-white text-black text-[9px] font-black px-1 py-0 font-mono">
                            {PERSONA_META[toPersona].arcana}
                          </span>
                          <span className="text-xs font-black text-white">{toPersona}</span>
                          <span className="text-[#e60012] font-mono font-bold text-[10px]">
                            Lv.{PERSONA_META[toPersona].level}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Search Strategy */}
                  <div>
                    <label className="block text-[11px] font-black text-zinc-300 mb-1">
                      搜索策略 (Strategy)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setStrategy('all')}
                        className={`p-2 text-xs font-black p5-skew-l shadow-[2px_2px_0_#000] transition-colors cursor-pointer text-center ${
                          strategy === 'all'
                            ? 'bg-[#e60012] text-white'
                            : 'bg-black text-zinc-400 hover:text-white border border-white/10'
                        }`}
                      >
                        <span className="p5-unskew-l block">多条可行路线 (Top K)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setStrategy('bfs')}
                        className={`p-2 text-xs font-black p5-skew-l shadow-[2px_2px_0_#000] transition-colors cursor-pointer text-center ${
                          strategy === 'bfs'
                            ? 'bg-[#e60012] text-white'
                            : 'bg-black text-zinc-400 hover:text-white border border-white/10'
                        }`}
                      >
                        <span className="p5-unskew-l block">单条极速最短 (BFS)</span>
                      </button>
                    </div>
                  </div>

                  {/* Action Button: Directly under inputs & strategy so it's always in direct reach */}
                  <div className="pt-2">
                    <button
                      onClick={handleCalculate}
                      className="w-full py-2.5 sm:py-3 bg-[#e60012] hover:bg-white text-white hover:text-black font-black text-xs sm:text-sm tracking-wider uppercase p5-skew-l shadow-[3px_3px_0_#000] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <span className="p5-unskew-l flex items-center gap-2">
                        <Zap className="w-4 h-4 fill-current" />
                        <span>开始计算合成路线</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Runtime Stats */}
              {hasCalculated && (
                <div className="pt-2 border-t border-white/10">
                  <div className="bg-black/60 p-2.5 border border-white/10 text-[11px] font-mono space-y-1 text-zinc-400">
                    <div className="flex justify-between">
                      <span>全书面具节点:</span>
                      <strong className="text-white">{calcStats.nodeCount} 款</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>已录入配方边数:</span>
                      <strong className="text-white">{calcStats.edgeCount} 条</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>图搜索耗时:</span>
                      <strong className="text-[#f6c344] font-black">{calcStats.durationMs.toFixed(2)} ms</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Results: Path List */}
            <div className="lg:col-span-7 bg-[#14141d] border border-white/10 p-4 sm:p-5 shadow-[4px_4px_0_#000] flex flex-col">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3.5">
                <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#e60012] p5-skew-l inline-block" />
                  合成路径求解结果
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 p5-skew-l ${
                    !hasCalculated
                      ? 'bg-zinc-800 text-zinc-400'
                      : resultPaths.length > 0
                      ? 'bg-[#107c41] text-white shadow-[1px_1px_0_#000]'
                      : 'bg-[#b8000e] text-white'
                  }`}
                >
                  <span className="p5-unskew-l">
                    {!hasCalculated
                      ? '待计算'
                      : resultPaths.length > 0
                      ? `找到 ${resultPaths.length} 条路线`
                      : '无可行合成链'}
                  </span>
                </span>
              </div>

              {/* Result Container */}
              <div className="flex-1 space-y-3">
                {!hasCalculated ? (
                  <div className="py-14 text-center text-zinc-400">
                    <Sparkles className="w-8 h-8 text-[#e60012] mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-bold">请在左侧选择起始与目标面具，点击按钮计算最优链条</p>
                  </div>
                ) : fromPersona === toPersona ? (
                  <div className="py-12 text-center text-zinc-400 bg-black/40 p-4 border border-white/10">
                    <Info className="w-7 h-7 text-[#f6c344] mx-auto mb-2" />
                    <p className="text-xs text-white font-black">起点与目标面具相同</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">无需进行任何合成操作。</p>
                  </div>
                ) : resultPaths.length === 0 ? (
                  <div className="py-12 text-center text-zinc-400 bg-black/40 p-4 border border-white/10">
                    <Info className="w-7 h-7 text-[#e60012] mx-auto mb-2" />
                    <p className="text-xs text-white font-black">未搜索到可行合成路径</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      在 6 步深度内未检索到连通两者的合成路线，建议尝试其它中间面具转接。
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {resultPaths.map((path, pathIdx) => {
                      const isShortest = pathIdx === 0;
                      return (
                        <div
                          key={`path-${pathIdx}`}
                          className="bg-[#0b0b0f] border border-white/10 p-3 sm:p-4 shadow-[2px_2px_0_#000] space-y-2.5 transition-all hover:border-[#e60012]/60"
                        >
                          {/* Path Header */}
                          <div className="flex items-center justify-between border-b border-white/5 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-white">
                                方案 {pathIdx + 1}
                              </span>
                              <span className="text-[10px] font-mono font-bold text-zinc-400 bg-white/5 px-1.5 py-0.5 border border-white/10">
                                {path.totalSteps} 步合成
                              </span>
                              {isShortest && (
                                <span className="text-[10px] font-bold bg-[#e60012] text-white px-1.5 py-0.5 p5-skew-l shadow-[1px_1px_0_#000]">
                                  <span className="p5-unskew-l">最短路径</span>
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() => handleCopyPath(path, pathIdx)}
                              className="text-[11px] font-bold text-zinc-400 hover:text-white bg-black hover:bg-[#e60012] px-2 py-0.5 p5-skew-l border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                              title="复制完整路径文字"
                            >
                              <span className="p5-unskew-l flex items-center gap-1">
                                {copiedPathIndex === pathIdx ? (
                                  <>
                                    <Check className="w-3 h-3 text-[#107c41]" />
                                    <span className="text-white text-[10px]">已复制</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3 text-zinc-400" />
                                    <span>复制路线</span>
                                  </>
                                )}
                              </span>
                            </button>
                          </div>

                          {/* Step list */}
                          <div className="space-y-2">
                            {path.steps.map((step, sIdx) => {
                              const targetMeta = PERSONA_META[step.target];
                              return (
                                <div
                                  key={`step-${sIdx}`}
                                  className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs bg-[#111117] p-2 sm:p-2.5 border border-white/5 shadow-[1px_1px_0_#000]"
                                >
                                  {/* Step Number */}
                                  <span className="w-5 h-5 bg-[#e60012] text-white flex items-center justify-center font-mono font-black text-[10px] p5-skew-l shrink-0 shadow-[1px_1px_0_#000]">
                                    <span className="p5-unskew-l">{sIdx + 1}</span>
                                  </span>

                                  {/* Step Materials Badge Sequence */}
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    {/* Primary Material (From) */}
                                    <MaterialBadge
                                      material={{
                                        name: step.from.name,
                                        level: step.from.requiredLevel,
                                        requiredLevel: step.from.requiredLevel,
                                        baseLevel: step.from.baseLevel,
                                      }}
                                      onClick={() => onSelectPersona(step.from.name)}
                                      compact
                                    />

                                    <span className="text-zinc-400 font-black text-xs select-none">+</span>

                                    {/* Other Partner Materials */}
                                    {step.otherMaterials.map((mat, mIdx) => (
                                      <React.Fragment key={`mat-${mIdx}`}>
                                        {mIdx > 0 && <span className="text-zinc-400 font-black text-xs select-none">+</span>}
                                        <MaterialBadge
                                          material={{
                                            name: mat.name,
                                            level: mat.requiredLevel,
                                            requiredLevel: mat.requiredLevel,
                                            baseLevel: mat.baseLevel,
                                          }}
                                          onClick={() => onSelectPersona(mat.name)}
                                          compact
                                        />
                                      </React.Fragment>
                                    ))}
                                  </div>

                                  <ArrowRight className="w-3.5 h-3.5 text-[#e60012] shrink-0 mx-0.5" />

                                  {/* Yields Target: Consistent Red Cut-Out Badge (Like Main Table, No Underline) */}
                                  <button
                                    onClick={() => onSelectPersona(step.target)}
                                    className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 bg-[#e60012] hover:bg-white text-white hover:text-black font-extrabold text-xs p5-skew-l shadow-[2px_2px_0_#000] transition-colors cursor-pointer active:scale-95"
                                    title={`查看 ${step.target} 合体详情`}
                                  >
                                    <span className="p5-unskew-l flex items-center gap-1">
                                      {targetMeta?.arcana && (
                                        <span className="bg-black text-white text-[9px] px-1 py-0 font-bold leading-tight">
                                          {targetMeta.arcana}
                                        </span>
                                      )}
                                      <span>{step.target}</span>
                                      <span className="font-mono text-[10px] text-white/90">
                                        Lv.{targetMeta?.level || step.targetLevel}
                                      </span>
                                    </span>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Bottom Card: Algorithm & Theory Explained */}
          <div className="bg-[#121218] border border-white/10 p-4 sm:p-5 shadow-[4px_4px_0_#000]">
            <h3 className="text-xs sm:text-sm font-black text-[#f6c344] uppercase tracking-wider mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#f6c344]" />
              算法思考逻辑与实现原理 (Theoretical Background)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-zinc-400 leading-relaxed">
              <div className="bg-black/50 p-3 border border-white/5 space-y-1">
                <div className="font-black text-white text-[11px] sm:text-xs">
                  1. 超图状态抽象 (Hypergraph)
                </div>
                <p className="text-[11px] text-zinc-400">
                  面具合成非普通的一对一转移，而是 <code className="text-[#e60012] font-mono">(A + B) ➔ C</code> 的多元算子。我们将每个面具作为状态节点，合体配方建立为有向超边图。
                </p>
              </div>

              <div className="bg-black/50 p-3 border border-white/5 space-y-1">
                <div className="font-black text-white text-[11px] sm:text-xs">
                  2. 广度优先搜索 (BFS)
                </div>
                <p className="text-[11px] text-zinc-400">
                  为了寻找**步数最少**的路线，从起点面具逐层扩散：1 步可达 ➔ 2 步可达 ➔ N 步。首次击中目标节点时，数学上可严格证明该链条步数最短。
                </p>
              </div>

              <div className="bg-black/50 p-3 border border-white/5 space-y-1">
                <div className="font-black text-white text-[11px] sm:text-xs">
                  3. 同系降级与跨系转换
                </div>
                <p className="text-[11px] text-zinc-400">
                  在游戏机制中，高等级推导到低等级时，同塔罗牌合成通常会降低等级，而跨系合成则切换塔罗牌。算法直接依托完整全书 368 条真实配方求解，结果 100% 游戏中可用。
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
