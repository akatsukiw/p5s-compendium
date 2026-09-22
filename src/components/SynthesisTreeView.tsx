import React, { useState, useMemo } from 'react';
import {
  PERSONA_META,
  RECIPES_BY_TARGET,
  DOWNSTREAM_BY_MATERIAL,
  ALL_PERSONA_NAMES,
  ARCANA_ORDER,
} from '../data/personaData';
import { ArcanaBadge } from './ArcanaBadge';
import {
  GitFork,
  Layers,
  Sparkles,
  Search,
  RotateCcw,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { FusionRow } from '../types';

interface Props {
  selectedPersona: string;
  onSelectPersona: (name: string) => void;
  onInspectPersona: (name: string) => void;
}

type SubTab = 'horizontal-tree' | 'recipes' | 'downstream';

export const SynthesisTreeView: React.FC<Props> = ({
  selectedPersona,
  onSelectPersona,
}) => {
  const [subTab, setSubTab] = useState<SubTab>('horizontal-tree');
  const [searchSidebar, setSearchSidebar] = useState('');
  const [filterArcana, setFilterArcana] = useState('ALL');
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(0);
  const [history, setHistory] = useState<string[]>([selectedPersona]);

  // Downstream search filter in tab 3
  const [downstreamSearch, setDownstreamSearch] = useState('');

  const currentMeta = PERSONA_META[selectedPersona] || { arcana: '愚者', level: 1 };
  
  // All recipes that result in selectedPersona
  const directRecipes = useMemo(
    () => RECIPES_BY_TARGET[selectedPersona] || [],
    [selectedPersona]
  );

  // All downstream recipes where selectedPersona is an ingredient
  const downstreamRecipes = useMemo(
    () => DOWNSTREAM_BY_MATERIAL[selectedPersona] || [],
    [selectedPersona]
  );

  // Group downstream results by target persona with materials list clearly retained
  const downstreamGrouped = useMemo(() => {
    const map = new Map<string, FusionRow[]>();
    for (const r of downstreamRecipes) {
      if (!map.has(r.name)) map.set(r.name, []);
      map.get(r.name)!.push(r);
    }
    return Array.from(map.entries())
      .map(([targetName, recipes]) => ({
        targetName,
        targetMeta: PERSONA_META[targetName] || { arcana: '未知', level: 0 },
        recipes,
      }))
      .sort((a, b) => a.targetMeta.level - b.targetMeta.level);
  }, [downstreamRecipes]);

  // Filtered downstream list
  const filteredDownstream = useMemo(() => {
    if (!downstreamSearch.trim()) return downstreamGrouped;
    const q = downstreamSearch.trim().toLowerCase();
    return downstreamGrouped.filter(
      (item) =>
        item.targetName.toLowerCase().includes(q) ||
        item.targetMeta.arcana.toLowerCase().includes(q) ||
        item.recipes.some((r) =>
          r.materials.some((m) => m.name.toLowerCase().includes(q))
        )
    );
  }, [downstreamGrouped, downstreamSearch]);

  // Handle persona selection with history tracking
  const handleSelect = (name: string) => {
    if (name === selectedPersona) return;
    setHistory((prev) => [...prev, name]);
    setSelectedRecipeIndex(0);
    onSelectPersona(name);
  };

  const handleBackHistory = () => {
    if (history.length <= 1) return;
    const newHist = [...history];
    newHist.pop();
    const prevName = newHist[newHist.length - 1];
    setHistory(newHist);
    setSelectedRecipeIndex(0);
    onSelectPersona(prevName);
  };

  // Filtered sidebar list
  const sidebarList = useMemo(() => {
    return ALL_PERSONA_NAMES.filter((name) => {
      const meta = PERSONA_META[name];
      const matchSearch =
        !searchSidebar ||
        name.toLowerCase().includes(searchSidebar.toLowerCase()) ||
        meta.arcana.includes(searchSidebar);
      const matchArcana = filterArcana === 'ALL' || meta.arcana === filterArcana;
      return matchSearch && matchArcana;
    });
  }, [searchSidebar, filterArcana]);

  // Active direct recipe for 3-tier horizontal expansion
  const activeRecipe = directRecipes[selectedRecipeIndex] || directRecipes[0];

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Sidebar: Persona Selector */}
      <div className="lg:col-span-3 space-y-3">
        <div className="bg-[#121218] border border-zinc-800 p-4 shadow-[4px_4px_0_#000]">
          <div className="flex items-center justify-between pb-2 border-b-2 border-[#e60012] mb-3">
            <h3 className="font-black text-sm text-white tracking-wide flex items-center gap-2">
              <span className="w-2 h-4 bg-[#e60012] inline-block p5-skew-l" />
              面具目录清单
            </h3>
            <span className="text-xs font-mono font-bold text-zinc-300 bg-black/60 px-2 py-0.5 border border-zinc-800">
              {sidebarList.length} 体
            </span>
          </div>

          {/* Quick Search */}
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              value={searchSidebar}
              onChange={(e) => setSearchSidebar(e.target.value)}
              placeholder="搜索面具名或塔罗牌..."
              className="w-full bg-[#0a0a0d] text-white pl-8 pr-3 py-1.5 text-xs border border-zinc-700 focus:border-[#e60012] focus:outline-none"
            />
          </div>

          {/* Arcana dropdown */}
          <select
            value={filterArcana}
            onChange={(e) => setFilterArcana(e.target.value)}
            className="w-full bg-[#0a0a0d] text-zinc-300 px-2 py-1.5 text-xs border border-zinc-700 mb-3 focus:outline-none"
          >
            <option value="ALL">全部塔罗牌 (All Arcanas)</option>
            {ARCANA_ORDER.map((arc) => (
              <option key={arc} value={arc}>
                {arc} ({ALL_PERSONA_NAMES.filter((n) => PERSONA_META[n].arcana === arc).length})
              </option>
            ))}
          </select>

          {/* Persona Scroll List */}
          <div className="max-h-[620px] overflow-y-auto space-y-1 pr-1">
            {sidebarList.map((name) => {
              const meta = PERSONA_META[name];
              const isSelected = name === selectedPersona;
              return (
                <button
                  key={name}
                  onClick={() => handleSelect(name)}
                  className={`w-full text-left px-2.5 py-1.5 text-xs font-bold transition-all flex items-center justify-between border ${
                    isSelected
                      ? 'bg-[#e60012] text-white border-white shadow-[2px_2px_0_#000]'
                      : 'bg-[#161620] text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:bg-[#20202c]'
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <span className="font-mono text-[10px] text-zinc-400 font-bold">
                      Lv{meta.level}
                    </span>
                    <span className="truncate">{name}</span>
                  </span>
                  <ArcanaBadge arcana={meta.arcana} size="sm" skew={false} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Main Stage: Horizontal 3-Tier Tree & Clean Views */}
      <div className="lg:col-span-9 space-y-5">
        
        {/* Breadcrumb Path History */}
        {history.length > 1 && (
          <div className="bg-[#121218] border border-zinc-800 px-4 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto">
              <span className="text-zinc-500 font-bold">浏览历史:</span>
              {history.map((hName, idx) => (
                <React.Fragment key={`${hName}-${idx}`}>
                  {idx > 0 && <span className="text-[#e60012]">→</span>}
                  <button
                    onClick={() => {
                      const sliced = history.slice(0, idx + 1);
                      setHistory(sliced);
                      setSelectedRecipeIndex(0);
                      onSelectPersona(hName);
                    }}
                    className={`font-bold hover:underline ${
                      idx === history.length - 1 ? 'text-zinc-100 font-black' : 'text-zinc-400'
                    }`}
                  >
                    {hName} Lv{PERSONA_META[hName]?.level}
                  </button>
                </React.Fragment>
              ))}
            </div>
            <button
              onClick={handleBackHistory}
              className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold flex items-center gap-1 text-[11px] border border-zinc-700 whitespace-nowrap ml-2"
            >
              <RotateCcw className="w-3 h-3" />
              返回上一步
            </button>
          </div>
        )}

        {/* Current Persona Header Banner (Clean & High Contrast) */}
        <div className="bg-[#15151e] border-2 border-zinc-700 p-5 shadow-[4px_4px_0_#000] relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ArcanaBadge arcana={currentMeta.arcana} size="md" />
                <span className="bg-black text-zinc-200 font-mono font-bold text-xs px-2 py-0.5 border border-zinc-800">
                  Lv.{currentMeta.level}
                </span>
                <span className="text-[11px] text-zinc-400 font-bold">
                  {directRecipes.length > 0 ? `前置配方 ${directRecipes.length} 组` : '基础面具'}
                </span>
              </div>
              <h2 className="text-3xl font-black italic tracking-wide text-white flex items-center gap-2">
                {selectedPersona}
              </h2>
            </div>

            {/* Quick stats & action */}
            <div className="flex items-center gap-3 bg-black/60 p-2.5 border border-zinc-800">
              <div className="text-center px-3 border-r border-zinc-800">
                <div className="text-lg font-black text-white font-mono">{directRecipes.length}</div>
                <div className="text-[10px] text-zinc-400 font-bold">合成配方</div>
              </div>
              <div className="text-center px-3">
                <div className="text-lg font-black text-[#e60012] font-mono">{downstreamRecipes.length}</div>
                <div className="text-[10px] text-zinc-400 font-bold">可合成新面具</div>
              </div>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs (Unified & Concise) */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
          <button
            onClick={() => setSubTab('horizontal-tree')}
            className={`px-4 py-2 text-xs font-black transition-all flex items-center gap-1.5 border ${
              subTab === 'horizontal-tree'
                ? 'bg-[#e60012] text-white border-white shadow-[2px_2px_0_#000]'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            横向延伸合成图 (3层清晰树状图)
          </button>

          <button
            onClick={() => setSubTab('recipes')}
            className={`px-4 py-2 text-xs font-black transition-all flex items-center gap-1.5 border ${
              subTab === 'recipes'
                ? 'bg-[#e60012] text-white border-white shadow-[2px_2px_0_#000]'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            全部直接配方 ({directRecipes.length})
          </button>

          <button
            onClick={() => setSubTab('downstream')}
            className={`px-4 py-2 text-xs font-black transition-all flex items-center gap-1.5 border ${
              subTab === 'downstream'
                ? 'bg-[#e60012] text-white border-white shadow-[2px_2px_0_#000]'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            可合成什么 (清晰列出材料) ({downstreamGrouped.length})
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: 3-Tier Clear Horizontal Tree (横向延申图 - 直接全部清晰写出3层) */}
        {/* ========================================================================= */}
        {subTab === 'horizontal-tree' && (
          <div className="bg-[#121218] border-2 border-zinc-800 p-5 space-y-5 shadow-2xl">
            
            {/* Header & Recipe Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/50 p-3 border border-zinc-800">
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                  <GitFork className="w-4 h-4 text-[#e60012]" />
                  3层完整横向合成溯源图谱
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  【第1层 原料】 ➔ 【第2层 直接材料】 ➔ 【第3层 最终目标：{selectedPersona}】。每层均清晰列出对应塔罗牌与等级。
                </p>
              </div>

              {directRecipes.length > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400 whitespace-nowrap font-bold">切换方案:</span>
                  <select
                    value={selectedRecipeIndex}
                    onChange={(e) => setSelectedRecipeIndex(Number(e.target.value))}
                    className="bg-[#181822] text-white text-xs px-2.5 py-1.5 border border-zinc-700 focus:border-[#e60012] focus:outline-none font-bold"
                  >
                    {directRecipes.map((r, i) => (
                      <option key={i} value={i}>
                        配方 #{i + 1}: {r.materials.map((m) => m.name).join(' + ')}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {directRecipes.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 bg-black/40 border border-zinc-800">
                <ShieldAlert className="w-8 h-8 mx-auto text-amber-500 mb-2" />
                <p className="font-bold text-white">暂无登记的直接合成配方</p>
                <p className="text-xs mt-1">此人格面具可能为基础面具、初始面具或特定剧情合体解锁。</p>
              </div>
            ) : (
              /* The 3-Tier Horizontal Tree Container */
              <div className="overflow-x-auto pb-4">
                <div className="min-w-[780px] space-y-4">
                  
                  {/* Column Titles */}
                  <div className="grid grid-cols-12 gap-3 text-xs font-black uppercase text-zinc-400 px-2">
                    <div className="col-span-5 bg-black/40 py-1.5 px-3 border-l-2 border-zinc-600">
                      Tier 1 · 基础原料 (Layer 1 Materials)
                    </div>
                    <div className="col-span-4 bg-black/40 py-1.5 px-3 border-l-2 border-[#e60012]">
                      Tier 2 · 直接合成材料 (Layer 2)
                    </div>
                    <div className="col-span-3 bg-black/40 py-1.5 px-3 border-l-2 border-white text-white">
                      Tier 3 · 最终目标 (Target)
                    </div>
                  </div>

                  {/* Body Layout: Level 2 items connected to Level 1 and Target */}
                  <div className="grid grid-cols-12 gap-3 items-stretch">
                    
                    {/* Left & Middle: Tier 1 and Tier 2 rows */}
                    <div className="col-span-9 space-y-4">
                      {activeRecipe.materials.map((mat, matIdx) => {
                        const matMeta = PERSONA_META[mat.name] || { arcana: '未知', level: mat.level };
                        const subRecipes = RECIPES_BY_TARGET[mat.name] || [];
                        const primarySubRecipe = subRecipes[0]; // First canonical sub-recipe

                        return (
                          <div
                            key={`${mat.name}-${matIdx}`}
                            className="grid grid-cols-9 gap-3 items-center bg-[#181822] border border-zinc-800 p-3 shadow-md"
                          >
                            {/* Tier 1 Box: Raw ingredients for this material (Col-span-5) */}
                            <div className="col-span-5 space-y-1.5">
                              <div className="text-[10px] font-mono text-zinc-400 flex items-center justify-between pb-1 border-b border-zinc-800">
                                <span>{mat.name} 的合成原料：</span>
                                {subRecipes.length > 1 && (
                                  <span className="text-zinc-500">共{subRecipes.length}条路线</span>
                                )}
                              </div>

                              {primarySubRecipe ? (
                                <div className="space-y-1">
                                  {primarySubRecipe.materials.map((subMat, sIdx) => {
                                    const subMeta = PERSONA_META[subMat.name] || { arcana: '未知', level: subMat.level };
                                    return (
                                      <div
                                        key={sIdx}
                                        className="flex items-center justify-between bg-black/50 px-2.5 py-1.5 border border-zinc-800 text-xs hover:border-zinc-600 transition-colors"
                                      >
                                        <div className="flex items-center gap-1.5 truncate">
                                          <ArcanaBadge arcana={subMeta.arcana} size="sm" skew={false} />
                                          <button
                                            onClick={() => handleSelect(subMat.name)}
                                            className="font-bold text-zinc-200 hover:text-[#e60012] truncate text-left"
                                          >
                                            {subMat.name}
                                          </button>
                                        </div>
                                        <span className="font-mono text-zinc-400 text-[11px] font-bold">
                                          Lv.{subMat.level}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="bg-black/30 p-2 text-center text-[11px] text-zinc-500 border border-zinc-800/80">
                                  基础面具 / 无法继续向下分解
                                </div>
                              )}
                            </div>

                            {/* Arrow connector */}
                            <div className="col-span-4 flex items-center gap-2 pl-1 border-l border-zinc-700">
                              <span className="text-[#e60012] font-black text-sm">➔</span>
                              
                              {/* Tier 2 Material Card */}
                              <div className="flex-1 bg-[#1e1e2c] border-2 border-zinc-700 hover:border-[#e60012] p-2.5 transition-colors">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <ArcanaBadge arcana={matMeta.arcana} size="sm" skew={false} />
                                  <span className="font-mono text-zinc-400 font-bold text-[11px]">
                                    Lv.{mat.level}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <button
                                    onClick={() => handleSelect(mat.name)}
                                    className="font-black text-sm text-white hover:text-[#e60012] transition-colors text-left"
                                  >
                                    {mat.name}
                                  </button>
                                  <button
                                    onClick={() => handleSelect(mat.name)}
                                    className="text-[10px] text-zinc-400 hover:text-white font-bold underline"
                                  >
                                    设为主视角
                                  </button>
                                </div>
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>

                    {/* Right: Tier 3 Target Persona Box (Col-span-3) */}
                    <div className="col-span-3 flex flex-col justify-center items-center bg-[#1d1d28] border-2 border-[#e60012] p-5 shadow-[4px_4px_0_#000] relative">
                      <div className="text-center space-y-2">
                        <span className="bg-[#e60012] text-white text-[11px] font-black px-2 py-0.5 inline-block">
                          最终合成目标
                        </span>
                        
                        <div className="pt-1">
                          <ArcanaBadge arcana={currentMeta.arcana} size="md" skew={false} />
                        </div>

                        <div className="text-2xl font-black italic text-white tracking-wide">
                          {selectedPersona}
                        </div>

                        <div className="font-mono text-zinc-300 font-bold text-xs bg-black/60 px-2 py-1 border border-zinc-800 inline-block">
                          LEVEL {currentMeta.level}
                        </div>

                        <div className="text-[11px] text-zinc-400 pt-2 border-t border-zinc-800">
                          融合 {activeRecipe.materials.length} 个直接材料
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: Clean & Concise All Direct Recipes (简洁直观直接配方列表) */}
        {/* ========================================================================= */}
        {subTab === 'recipes' && (
          <div className="bg-[#121218] border border-zinc-800 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs">
              <span className="text-zinc-300 font-bold">
                收录合成 <span className="text-white font-black">{selectedPersona}</span> 的全部 {directRecipes.length} 组直接配方：
              </span>
              <span className="text-zinc-500">点击任意材料名称可快速跳转</span>
            </div>

            {directRecipes.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 bg-black/30 border border-zinc-800">
                暂无登记的直接合成配方。
              </div>
            ) : (
              <div className="space-y-2">
                {directRecipes.map((recipe, idx) => (
                  <div
                    key={recipe.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#161622] hover:bg-[#1a1a28] border border-zinc-800 hover:border-zinc-600 p-3 transition-colors"
                  >
                    {/* Index label */}
                    <div className="flex items-center gap-2">
                      <span className="bg-zinc-800 text-zinc-200 font-mono text-xs font-black px-2 py-0.5 border border-zinc-700">
                        #{idx + 1}
                      </span>
                    </div>

                    {/* Materials row (clean and concise) */}
                    <div className="flex-1 flex flex-wrap items-center gap-2">
                      {recipe.materials.map((mat, mIdx) => {
                        const mMeta = PERSONA_META[mat.name];
                        return (
                          <React.Fragment key={mIdx}>
                            {mIdx > 0 && <span className="text-[#e60012] font-black text-sm">＋</span>}
                            <button
                              onClick={() => handleSelect(mat.name)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-black/60 hover:bg-zinc-800 border border-zinc-700 hover:border-[#e60012] transition-colors text-xs text-left"
                            >
                              {mMeta && <ArcanaBadge arcana={mMeta.arcana} size="sm" skew={false} />}
                              <span className="font-bold text-white">{mat.name}</span>
                              <span className="font-mono text-zinc-400 text-[11px] font-bold">
                                Lv{mat.level}
                              </span>
                            </button>
                          </React.Fragment>
                        );
                      })}
                    </div>

                    {/* View in 3-Tier tree button */}
                    <button
                      onClick={() => {
                        setSelectedRecipeIndex(idx);
                        setSubTab('horizontal-tree');
                      }}
                      className="px-3 py-1 bg-zinc-800 hover:bg-[#e60012] text-white text-xs font-bold transition-colors whitespace-nowrap self-start sm:self-auto"
                    >
                      查看此路线树状图 →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: Downstream - What Can this Persona Fuse Into? (清晰列出所有材料) */}
        {/* ========================================================================= */}
        {subTab === 'downstream' && (
          <div className="bg-[#121218] border border-zinc-800 p-5 space-y-4 shadow-xl">
            
            {/* Header & Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
              <div className="text-xs text-zinc-300">
                以 <span className="text-white font-bold">{selectedPersona}</span> 为原料，共可参与合成{' '}
                <span className="text-white font-black">{downstreamGrouped.length}</span> 体新人格面具（已清晰列出配对的全部原料）：
              </div>

              {/* Quick Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                <input
                  type="text"
                  value={downstreamSearch}
                  onChange={(e) => setDownstreamSearch(e.target.value)}
                  placeholder="过滤生成面具或搭档材料..."
                  className="w-full bg-[#0a0a0d] text-white pl-8 pr-3 py-1.5 text-xs border border-zinc-700 focus:border-[#e60012] focus:outline-none"
                />
              </div>
            </div>

            {filteredDownstream.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 bg-black/30 border border-zinc-800">
                暂无匹配的下游合成记录。
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDownstream.map(({ targetName, targetMeta, recipes }) => (
                  <div
                    key={targetName}
                    className="bg-[#161622] border border-zinc-800 hover:border-zinc-600 p-3.5 transition-colors space-y-2.5"
                  >
                    {/* Top row: Target Persona Name, Arcana, Level */}
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <div className="flex items-center gap-2">
                        <ArcanaBadge arcana={targetMeta.arcana} size="sm" skew={false} />
                        <span className="font-mono text-zinc-400 font-bold text-xs">
                          Lv.{targetMeta.level}
                        </span>
                        <button
                          onClick={() => handleSelect(targetName)}
                          className="font-black text-base text-white hover:text-[#e60012] transition-colors"
                        >
                          {targetName}
                        </button>
                      </div>

                      <button
                        onClick={() => handleSelect(targetName)}
                        className="px-2.5 py-1 text-xs font-bold bg-zinc-800 hover:bg-[#e60012] text-white transition-colors flex items-center gap-1"
                      >
                        追踪此面具合成路线 →
                      </button>
                    </div>

                    {/* Bottom: Explicit list of recipes and materials */}
                    <div className="space-y-1.5 pl-2">
                      <div className="text-[11px] text-zinc-400 font-bold">配对材料明细：</div>
                      {recipes.map((r, rIdx) => (
                        <div
                          key={rIdx}
                          className="flex flex-wrap items-center gap-1.5 text-xs bg-black/40 p-2 border border-zinc-800/80"
                        >
                          <span className="text-zinc-500 text-[11px] font-mono mr-1">
                            方案 {rIdx + 1}:
                          </span>
                          {r.materials.map((m, mIdx) => {
                            const isCurrent = m.name === selectedPersona;
                            const mMeta = PERSONA_META[m.name];
                            return (
                              <React.Fragment key={mIdx}>
                                {mIdx > 0 && <span className="text-[#e60012] font-black">＋</span>}
                                <button
                                  onClick={() => handleSelect(m.name)}
                                  className={`px-2 py-1 border transition-colors flex items-center gap-1 ${
                                    isCurrent
                                      ? 'bg-[#e60012]/20 border-[#e60012] text-white font-black'
                                      : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-500'
                                  }`}
                                >
                                  {mMeta && (
                                    <span className="text-[10px] text-zinc-400">
                                      〖{mMeta.arcana}〗
                                    </span>
                                  )}
                                  <span>{m.name}</span>
                                  <span className="font-mono text-[10px] text-zinc-400">
                                    Lv{m.level}
                                  </span>
                                </button>
                              </React.Fragment>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};
