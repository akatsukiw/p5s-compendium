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
import { PersonaSelect } from './PersonaSelect';

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
  const [activeTab, setActiveTab] = useState<'all' | 'baseOnly'>('all');
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [allPaths, setAllPaths] = useState<FusionPathResult[]>([]);
  const [baseOnlyPaths, setBaseOnlyPaths] = useState<FusionPathResult[]>([]);
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

  // Execute calculation for both full set and pure base-level set
  const handleCalculate = () => {
    const resAll = findFusionPath(fromPersona, toPersona, strategy, 5, false);
    const resBase = findFusionPath(fromPersona, toPersona, strategy, 5, true);
    setAllPaths(resAll.paths);
    setBaseOnlyPaths(resBase.paths);
    setCalcStats({
      durationMs: resAll.durationMs + resBase.durationMs,
      nodeCount: resAll.nodeCount,
      edgeCount: resAll.edgeCount,
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

  const currentDisplayedPaths = activeTab === 'all' ? allPaths : baseOnlyPaths;

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
      {/* Outer Modal Container with Authentic Velvet Room Blue-Black Styling */}
      <div
        className="bg-[#060b17] border-2 border-[#1d4ed8] w-full max-w-6xl max-h-[94vh] lg:h-[90vh] lg:max-h-[880px] flex flex-col shadow-[0_0_40px_rgba(29,78,216,0.45)] text-white relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Ribbon: Velvet Room Mystical Blue */}
        <div className="h-1.5 bg-gradient-to-r from-[#0f2d70] via-[#60a5fa] to-[#0f2d70] shrink-0" />

        {/* Modal Header: Blue-Black Velvet Theme with Slanted Brand Badge */}
        <div className="px-4 py-3 sm:px-6 sm:py-3.5 bg-[#0a1226] border-b border-blue-900/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#1d4ed8] to-[#0b1b3d] border border-blue-400/40 text-white flex items-center justify-center p5-skew-l shadow-[2px_2px_0_#000]">
              <GitMerge className="w-5 h-5 sm:w-6 sm:h-6 p5-unskew-l text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black italic tracking-wide text-white uppercase">
                  <span className="text-[#60a5fa]">天鹅绒房间</span> · <span className="text-[#e60012]">合成路径寻路器</span>
                </h2>
                <span className="hidden xs:inline-block bg-[#172554] text-blue-300 border border-blue-500/30 font-mono text-[10px] font-black px-1.5 py-0.5 p5-skew-l">
                  <span className="p5-unskew-l">VELVET ROOM · BFS</span>
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-bold mt-0.5">
                基于图论超图拓扑，一键推导从任意起点面具到目标面具的最短降级/合成链条
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 bg-[#090f20] hover:bg-[#e60012] text-blue-200 hover:text-white border border-blue-900/50 flex items-center justify-center p5-skew-l transition-colors cursor-pointer shadow-[2px_2px_0_#000] active:scale-95"
            title="关闭窗口"
          >
            <span className="p5-unskew-l font-black text-sm">✕</span>
          </button>
        </div>

        {/* Modal Body: Smooth natural stack on mobile, independent panels on desktop */}
        <div className="flex-1 min-h-0 p-2.5 sm:p-4.5 flex flex-col overflow-y-auto lg:overflow-hidden bg-[#060b17] custom-scrollbar">
          
          {/* Main Layout: Stacked on mobile, 12-col grid on desktop */}
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-3.5 sm:gap-4 flex-1 lg:min-h-0">
            
            {/* Left Controls: Parameters - Natural height on mobile, fixed scroll on desktop */}
            <div className="lg:col-span-4 bg-[#0a1020] border border-blue-900/30 p-3 sm:p-4 shadow-[4px_4px_0_#000] flex flex-col justify-between shrink-0 lg:overflow-y-auto custom-scrollbar">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-[#e60012] p5-skew-l inline-block" />
                    <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                      参数设置
                    </span>
                    <span className="bg-black text-[#e60012] font-mono text-[10px] font-bold px-1.5 py-0.5 border border-white/10">
                      全书 67 款
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

                <div className="space-y-3">
                  {/* From Persona */}
                  <div className="bg-[#060b14] border border-white/10 p-2 sm:p-2.5 shadow-[2px_2px_0_#000]">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-[#e60012] text-white text-[9px] font-black font-mono px-1 py-0.2 p5-skew-l">
                          <span className="p5-unskew-l">START</span>
                        </span>
                        <label className="text-[11px] font-black tracking-wide text-white uppercase">
                          起点面具 (FROM)
                        </label>
                      </div>
                      <span className="text-[9.5px] text-zinc-400 font-mono font-bold">
                        Lv.升序 · {sortedPersonas.length} 款
                      </span>
                    </div>

                    <PersonaSelect
                      value={fromPersona}
                      onChange={setFromPersona}
                      options={sortedPersonas}
                      badgeType="START"
                    />
                  </div>

                  {/* To Persona */}
                  <div className="bg-[#060b14] border border-white/10 p-2 sm:p-2.5 shadow-[2px_2px_0_#000]">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-white text-black text-[9px] font-black font-mono px-1 py-0.2 p5-skew-l">
                          <span className="p5-unskew-l">GOAL</span>
                        </span>
                        <label className="text-[11px] font-black tracking-wide text-white uppercase">
                          目标面具 (TO)
                        </label>
                      </div>
                      <span className="text-[9.5px] text-zinc-400 font-mono font-bold">
                        Lv.升序 · {sortedPersonas.length} 款
                      </span>
                    </div>

                    <PersonaSelect
                      value={toPersona}
                      onChange={setToPersona}
                      options={sortedPersonas}
                      badgeType="GOAL"
                    />
                  </div>

                  {/* Search Strategy */}
                  <div>
                    <label className="block text-[11px] font-black text-zinc-300 mb-1">
                      搜索策略 (Strategy)
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setStrategy('all')}
                        className={`p-1.5 text-[11px] font-black p5-skew-l shadow-[2px_2px_0_#000] transition-colors cursor-pointer text-center ${
                          strategy === 'all'
                            ? 'bg-[#e60012] text-white'
                            : 'bg-black text-zinc-400 hover:text-white border border-white/10'
                        }`}
                      >
                        <span className="p5-unskew-l block">多条路线 (Top K)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setStrategy('bfs')}
                        className={`p-1.5 text-[11px] font-black p5-skew-l shadow-[2px_2px_0_#000] transition-colors cursor-pointer text-center ${
                          strategy === 'bfs'
                            ? 'bg-[#e60012] text-white'
                            : 'bg-black text-zinc-400 hover:text-white border border-white/10'
                        }`}
                      >
                        <span className="p5-unskew-l block">极速最短 (BFS)</span>
                      </button>
                    </div>
                  </div>

                  {/* Action Button: Pure P5 Red Action Button */}
                  <div className="pt-1">
                    <button
                      onClick={handleCalculate}
                      className="w-full py-2 sm:py-2.5 bg-[#e60012] hover:bg-white text-white hover:text-black font-black text-xs sm:text-sm tracking-wider uppercase p5-skew-l shadow-[3px_3px_0_#000] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <span className="p5-unskew-l flex items-center gap-1.5">
                        <Zap className="w-4 h-4 fill-current" />
                        <span>开始计算合成路线</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Runtime Stats */}
              {hasCalculated && (
                <div className="pt-2.5 border-t border-white/10 mt-3">
                  <div className="bg-black/60 p-2 border border-white/10 text-[10.5px] font-mono space-y-1 text-zinc-400">
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

            {/* Right Results: Path List - Fully visible on mobile, independent scroll on desktop */}
            <div className="lg:col-span-8 bg-[#0a1020] border border-blue-900/30 p-3 sm:p-4 shadow-[4px_4px_0_#000] flex flex-col shrink-0 lg:shrink lg:min-h-0 lg:overflow-hidden">
              
              {/* Right Panel Header: Title + Tab Options Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-2.5 mb-3 shrink-0 gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#e60012] p5-skew-l inline-block" />
                  <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                    合成路径求解结果
                  </span>
                </div>

                {/* Tab Switchers: All Paths vs Pure Base-Level (No Grinding) */}
                <div className="flex items-center gap-1.5 bg-[#060b14] p-1 border border-white/10 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab('all')}
                    className={`px-2.5 py-1 text-xs font-black p5-skew-l transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'all'
                        ? 'bg-[#e60012] text-white shadow-[1px_1px_0_#000]'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className="p5-unskew-l flex items-center gap-1">
                      <span>全部方案</span>
                      {hasCalculated && (
                        <span className={`text-[9.5px] px-1 py-0 font-mono ${activeTab === 'all' ? 'bg-black text-white' : 'bg-white/10 text-zinc-300'}`}>
                          {allPaths.length}
                        </span>
                      )}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('baseOnly')}
                    className={`px-2.5 py-1 text-xs font-black p5-skew-l transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'baseOnly'
                        ? 'bg-[#107c41] text-white shadow-[1px_1px_0_#000]'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                    title="排除所有要求练级的材料，仅使用图鉴初始等级的材料"
                  >
                    <span className="p5-unskew-l flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#ffe57f]" />
                      <span>免练级纯初始方案</span>
                      {hasCalculated && (
                        <span className={`text-[9.5px] px-1 py-0 font-mono ${activeTab === 'baseOnly' ? 'bg-black text-white' : 'bg-white/10 text-zinc-300'}`}>
                          {baseOnlyPaths.length}
                        </span>
                      )}
                    </span>
                  </button>
                </div>
              </div>

              {/* Dedicated Scroll Container for Right Side on Desktop, natural flow on Mobile */}
              <div className="lg:flex-1 lg:min-h-0 lg:overflow-y-auto custom-scrollbar pr-0 lg:pr-1.5 space-y-3">
                {!hasCalculated ? (
                  <div className="py-16 text-center text-zinc-400">
                    <Sparkles className="w-8 h-8 text-[#e60012] mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-bold">请在左侧选择起始与目标面具，点击按钮计算最优链条</p>
                  </div>
                ) : fromPersona === toPersona ? (
                  <div className="py-12 text-center text-zinc-400 bg-black/40 p-4 border border-white/10">
                    <Info className="w-7 h-7 text-[#f6c344] mx-auto mb-2" />
                    <p className="text-xs text-white font-black">起点与目标面具相同</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">无需进行任何合成操作。</p>
                  </div>
                ) : currentDisplayedPaths.length === 0 ? (
                  <div className="py-12 text-center text-zinc-400 bg-black/40 p-5 border border-white/10 space-y-2">
                    <Info className="w-7 h-7 text-[#e60012] mx-auto" />
                    <p className="text-xs text-white font-black">
                      {activeTab === 'baseOnly'
                        ? '未检索到【完全免练级】的直达方案'
                        : '未搜索到可行合成路径'}
                    </p>
                    <p className="text-[11px] text-zinc-400 max-w-md mx-auto leading-relaxed">
                      {activeTab === 'baseOnly'
                        ? '两面具之间的合成链条涉及需要练级（如霜精之王/邪恶霜精等）的前置材料。请切换至【全部方案】标签查看含练级要求的可行路径。'
                        : '在 6 步深度内未检索到连通两者的合成路线，建议尝试其它中间面具转接。'}
                    </p>
                    {activeTab === 'baseOnly' && allPaths.length > 0 && (
                      <button
                        onClick={() => setActiveTab('all')}
                        className="mt-2 px-3 py-1 bg-[#e60012] text-white text-xs font-black p5-skew-l hover:bg-white hover:text-black transition-colors cursor-pointer"
                      >
                        <span className="p5-unskew-l">查看全部 {allPaths.length} 条含练级方案 ➔</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentDisplayedPaths.map((path, pathIdx) => {
                      const isShortest = pathIdx === 0;
                      return (
                        <div
                          key={`path-${activeTab}-${pathIdx}`}
                          className="bg-[#060b14] border border-white/10 p-2.5 sm:p-3 shadow-[2px_2px_0_#000] space-y-2 transition-all hover:border-[#e60012]/60"
                        >
                          {/* Path Header */}
                          <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
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
                              {activeTab === 'baseOnly' && (
                                <span className="text-[10px] font-bold bg-[#107c41] text-white px-1.5 py-0.5 p5-skew-l shadow-[1px_1px_0_#000]">
                                  <span className="p5-unskew-l">★ 纯初始免练级</span>
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

                          {/* Step list: Materials on left with ample width, Target ALWAYS pinned right */}
                          <div className="space-y-1.5">
                            {path.steps.map((step, sIdx) => {
                              const targetMeta = PERSONA_META[step.target];
                              return (
                                <div
                                  key={`step-${sIdx}`}
                                  className="flex items-center justify-between gap-2 text-xs bg-[#0c1222] p-1.5 sm:p-2 border border-white/5 shadow-[1px_1px_0_#000]"
                                >
                                  {/* Left Container: Step Number + Materials */}
                                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                    {/* Step Number */}
                                    <span className="w-5 h-5 bg-[#e60012] text-white flex items-center justify-center font-mono font-black text-[10px] p5-skew-l shrink-0 shadow-[1px_1px_0_#000]">
                                      <span className="p5-unskew-l">{sIdx + 1}</span>
                                    </span>

                                    {/* Step Materials Sequence */}
                                    <div className="flex flex-wrap items-center gap-1 min-w-0 flex-1">
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

                                      <span className="text-zinc-400 font-black text-xs select-none shrink-0">+</span>

                                      {/* Other Partner Materials */}
                                      {step.otherMaterials.map((mat, mIdx) => (
                                        <React.Fragment key={`mat-${mIdx}`}>
                                          {mIdx > 0 && <span className="text-zinc-400 font-black text-xs select-none shrink-0">+</span>}
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
                                  </div>

                                  {/* Right Container: Arrow + Yields Target (ALWAYS Pinned to the Right Edge) */}
                                  <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-auto pl-1">
                                    <ArrowRight className="w-3.5 h-3.5 text-[#e60012] shrink-0" />

                                    <button
                                      onClick={() => onSelectPersona(step.target)}
                                      className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-[#e60012] hover:bg-white text-white hover:text-black font-extrabold text-[11px] sm:text-xs p5-skew-l shadow-[2px_2px_0_#000] transition-colors cursor-pointer active:scale-95 shrink-0"
                                      title={`查看 ${step.target} 合体详情`}
                                    >
                                      <span className="p5-unskew-l flex items-center gap-1">
                                        {targetMeta?.arcana && (
                                          <span className="bg-black text-white text-[8.5px] sm:text-[9.5px] px-1 py-0 font-bold leading-tight">
                                            {targetMeta.arcana}
                                          </span>
                                        )}
                                        <span className="tracking-tight">{step.target}</span>
                                        <span className="font-mono text-[9.5px] sm:text-[10.5px] text-white/90">
                                          Lv.{targetMeta?.level || step.targetLevel}
                                        </span>
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Bottom Theory Card nestled at bottom of scrollable results */}
                <div className="bg-[#060b14] border border-white/10 p-2.5 sm:p-3.5 shadow-[2px_2px_0_#000] mt-3">
                  <h3 className="text-xs font-black text-[#f6c344] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-[#f6c344]" />
                    算法原理与免练级机制说明 (Hypergraph BFS)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-zinc-400 leading-relaxed">
                    <div className="bg-black/50 p-2 border border-white/5">
                      <strong className="text-white block text-[10.5px] mb-0.5">1. 超图拓扑建模</strong>
                      <p className="text-[10px] text-zinc-400">将多材料合体建模为有向超边，面具为拓扑图节点。</p>
                    </div>
                    <div className="bg-black/50 p-2 border border-white/5">
                      <strong className="text-white block text-[10.5px] mb-0.5">2. 纯初始等级过滤</strong>
                      <p className="text-[10px] text-zinc-400">免练级模式严格筛选无黄色等级上升要求的原生态配方。</p>
                    </div>
                    <div className="bg-black/50 p-2 border border-white/5">
                      <strong className="text-white block text-[10.5px] mb-0.5">3. 广度优先 (BFS)</strong>
                      <p className="text-[10px] text-zinc-400">层层扩散搜索，数学保证首次命中路径为最少步数。</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
