import React, { useState, useMemo } from 'react';
import {
  FUSION_ROWS,
  PERSONA_META,
  ARCANA_ORDER,
  ALL_PERSONA_NAMES,
} from './data/personaData';
import {
  Search,
  ArrowUpDown,
  Filter,
  Copy,
  Check,
  X,
  Layers,
} from 'lucide-react';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArcana, setSelectedArcana] = useState('ALL');
  const [sortField, setSortField] = useState<'level' | 'arcana' | 'name'>('level');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quick detail modal state when clicking any persona name
  const [inspectedPersona, setInspectedPersona] = useState<string | null>(null);

  // Filter and sort for the main list / table
  const filteredRows = useMemo(() => {
    let result = FUSION_ROWS.filter((row) => {
      const matchesArcana = selectedArcana === 'ALL' || row.arcana === selectedArcana;
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !term ||
        row.name.toLowerCase().includes(term) ||
        row.arcana.toLowerCase().includes(term) ||
        row.materials.some((m) => m.name.toLowerCase().includes(term));

      return matchesArcana && matchesSearch;
    });

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'level') {
        cmp = a.level - b.level || a.name.localeCompare(b.name, 'zh');
      } else if (sortField === 'arcana') {
        cmp =
          ARCANA_ORDER.indexOf(a.arcana) - ARCANA_ORDER.indexOf(b.arcana) ||
          a.level - b.level ||
          a.name.localeCompare(b.name, 'zh');
      } else {
        cmp = a.name.localeCompare(b.name, 'zh');
      }
      return sortAsc ? cmp : -cmp;
    });

    return result;
  }, [searchTerm, selectedArcana, sortField, sortAsc]);

  // Copy fusion formula
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Toggle sort field
  const handleSortToggle = (field: 'level' | 'arcana' | 'name') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Recipes for currently inspected persona
  const inspectedMeta = inspectedPersona ? PERSONA_META[inspectedPersona] : null;

  // As Target recipes (How to synthesize this persona)
  const inspectedAsTargetRecipes = useMemo(() => {
    if (!inspectedPersona) return [];
    return FUSION_ROWS.filter((r) => r.name === inspectedPersona);
  }, [inspectedPersona]);

  // As Material recipes (What can this persona fuse into), strictly sorted by target level ascending
  const inspectedAsMaterialRecipes = useMemo(() => {
    if (!inspectedPersona) return [];
    const list = FUSION_ROWS.filter((r) =>
      r.materials.some((m) => m.name === inspectedPersona)
    );
    // Sort strictly by target persona level ascending, then by name
    return list.sort((a, b) => {
      const metaA = PERSONA_META[a.name]?.level || a.level;
      const metaB = PERSONA_META[b.name]?.level || b.level;
      return metaA - metaB || a.name.localeCompare(b.name, 'zh');
    });
  }, [inspectedPersona]);

  return (
    <div className="min-h-screen bg-[#08080a] text-white p5-bg-pattern selection:bg-[#e60012] selection:text-white pb-16 sm:pb-20 relative overflow-x-hidden">
      
      {/* P5 Signature Background Giant Red Slanted Polygon */}
      <div className="fixed -top-48 -right-48 w-[400px] sm:w-[600px] h-[600px] sm:h-[900px] bg-[#e60012]/15 rotate-12 pointer-events-none p5-skew-l" />
      <div className="fixed top-1/2 -left-64 w-[350px] sm:w-[500px] h-[600px] sm:h-[900px] bg-white/[0.02] -rotate-12 pointer-events-none p5-skew-r" />

      {/* TOP P5S LOGO & HERO HEADER */}
      <header className="sticky top-0 z-40 bg-[#09090d]/95 backdrop-blur-md shadow-[0_4px_0_#000]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
            
            {/* Logo Badge in P5S Cut-Out Style */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="bg-[#e60012] text-white font-p5-display text-xl sm:text-2xl px-2.5 sm:px-3.5 py-0.5 sm:py-1 p5-skew-l shadow-[3px_3px_0_#000] flex items-center justify-center shrink-0">
                <span className="p5-unskew-l tracking-tighter">P5S</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-2xl font-black italic tracking-wider text-white uppercase truncate">
                    Persona 5 <span className="text-[#e60012]">Strikers</span>
                  </h1>
                  <span className="bg-white text-black font-mono text-[10px] sm:text-[11px] font-black px-1.5 sm:px-2 py-0.5 p5-skew-l shadow-[2px_2px_0_#000] shrink-0">
                    <span className="p5-unskew-l">合体全书</span>
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-zinc-400 font-bold tracking-wide mt-0.5 line-clamp-1">
                  女神异闻录5对决：幽灵先锋 · 合体配方资料库
                </p>
              </div>
            </div>

            {/* Quick Status Stats */}
            <div className="flex items-center gap-2 bg-[#121217] px-3 py-1 self-start sm:self-auto shadow-[3px_3px_0_#000] p5-skew-l border border-white/5">
              <div className="p5-unskew-l flex items-center gap-2.5 text-[11px] sm:text-xs font-bold">
                <span className="text-zinc-300">
                  全书: <strong className="text-white font-mono">{ALL_PERSONA_NAMES.length}</strong> 体
                </span>
                <span className="w-1.5 h-2.5 bg-[#e60012] inline-block" />
                <span className="text-zinc-300">
                  配方: <strong className="text-[#e60012] font-mono">{FUSION_ROWS.length}</strong> 条
                </span>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-2.5 sm:px-6 pt-3 sm:pt-6 space-y-4 sm:space-y-6">

        {/* SEARCH & ARCANA FILTER BANNER */}
        <div className="relative bg-[#121218] p-3 sm:p-5 shadow-[4px_4px_0_#000] sm:shadow-[6px_6px_0_#000] p5-cut-card">
          {/* Top Red Bar Decor */}
          <div className="absolute top-0 left-0 right-0 h-1 sm:h-1.5 bg-[#e60012]" />

          {/* Search bar & Sorting bar */}
          <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2.5 sm:gap-3 items-stretch sm:items-center">
            
            {/* Search Input */}
            <div className="sm:col-span-8 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-[#e60012]" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索面具名、材料名、塔罗牌（如：亚森、死神）..."
                className="w-full bg-[#08080b] text-white pl-9 sm:pl-10 pr-12 sm:pr-10 py-2 text-xs sm:text-sm font-bold shadow-[2px_2px_0_#000] focus:bg-[#000000] focus:outline-none focus:ring-2 focus:ring-[#e60012] transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-white bg-[#e60012] hover:bg-black px-1.5 py-0.5 font-black transition-colors"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sorting Field */}
            <div className="sm:col-span-4 flex items-center gap-2">
              <span className="text-[11px] sm:text-xs text-zinc-300 font-bold whitespace-nowrap">排序:</span>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as any)}
                className="flex-1 min-w-0 bg-[#08080b] text-white px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-black shadow-[2px_2px_0_#000] focus:outline-none focus:ring-2 focus:ring-[#e60012]"
              >
                <option value="level">按 等级 (Lv) 排序</option>
                <option value="arcana">按 塔罗牌 (Arcana) 排序</option>
                <option value="name">按 面具名称 (Name) 排序</option>
              </select>
              <button
                onClick={() => setSortAsc(!sortAsc)}
                title={sortAsc ? '切换为降序' : '切换为升序'}
                className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-[#e60012] hover:bg-white hover:text-black text-white font-black text-xs flex items-center gap-1 shadow-[2px_2px_0_#000] transition-colors whitespace-nowrap p5-skew-l shrink-0"
              >
                <span className="p5-unskew-l flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>{sortAsc ? '升序↑' : '降序↓'}</span>
                </span>
              </button>
            </div>

          </div>

          {/* Arcana Filter Tags */}
          <div className="mt-3 pt-2.5 sm:pt-3 border-t border-white/10 flex items-center gap-1.5 flex-wrap max-h-32 sm:max-h-none overflow-y-auto sm:overflow-visible pr-1 sm:pr-0">
            <span className="text-[10px] sm:text-[11px] text-zinc-300 font-black uppercase mr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3 text-[#e60012]" /> 塔罗牌:
            </span>
            <button
              onClick={() => setSelectedArcana('ALL')}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-black transition-all p5-skew-l shadow-[2px_2px_0_#000] shrink-0 ${
                selectedArcana === 'ALL'
                  ? 'bg-[#e60012] text-white ring-2 ring-white'
                  : 'bg-white text-black hover:bg-[#e60012] hover:text-white'
              }`}
            >
              <span className="p5-unskew-l">全部 ({FUSION_ROWS.length})</span>
            </button>
            {ARCANA_ORDER.map((arc) => {
              const isSel = selectedArcana === arc;
              const count = FUSION_ROWS.filter((r) => r.arcana === arc).length;
              if (count === 0) return null;
              return (
                <button
                  key={arc}
                  onClick={() => setSelectedArcana(arc)}
                  className={`px-1.5 py-0.5 sm:px-2 text-[11px] sm:text-xs font-black transition-all p5-skew-l shadow-[2px_2px_0_#000] shrink-0 ${
                    isSel
                      ? 'bg-[#e60012] text-white ring-2 ring-white scale-105'
                      : 'bg-white text-black hover:bg-[#e60012] hover:text-white'
                  }`}
                >
                  <span className="p5-unskew-l">
                    {arc} <span className="text-[9px] sm:text-[10px] font-mono">({count})</span>
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* ============================================================ */}
        {/* MOBILE CARD VIEW (手机端自适应卡片列表，小屏幕时显示，md及以上隐藏) */}
        {/* ============================================================ */}
        <div className="block md:hidden space-y-3">
          {/* Mobile Top Stats Banner */}
          <div className="bg-[#181822] px-3 py-2 flex items-center justify-between border-l-4 border-[#e60012] shadow-[2px_2px_0_#000]">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#e60012]" />
              <span className="text-xs font-black uppercase text-white tracking-wider">
                面具配方列表
              </span>
            </div>
            <div className="text-[11px] text-zinc-300 font-mono font-bold">
              <strong className="text-white font-black">{filteredRows.length}</strong> / {FUSION_ROWS.length}
            </div>
          </div>

          {filteredRows.length === 0 ? (
            <div className="py-12 px-4 text-center bg-[#121218] shadow-[4px_4px_0_#000] p5-cut-card">
              <div className="text-sm text-white font-black mb-1">未检索到匹配的人格面具资料</div>
              <p className="text-xs text-zinc-400">请尝试切换搜索关键字或重置塔罗牌筛选</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredRows.map((row) => (
                <div
                  key={row.id}
                  className="bg-[#121218] p-3 shadow-[4px_4px_0_#000] border border-white/5 relative"
                >
                  {/* Card Header: Target Persona, Arcana, Level & Copy Button */}
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/10">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-black bg-white text-black p5-skew-l shadow-[1px_1px_0_#000] shrink-0">
                        <span className="p5-unskew-l">{row.arcana}</span>
                      </span>
                      <span className="font-mono font-black text-white bg-black px-1 py-0.5 text-[10px] inline-block shadow-[1px_1px_0_#000] shrink-0">
                        Lv.{row.level}
                      </span>
                      <button
                        onClick={() => setInspectedPersona(row.name)}
                        className="inline-flex items-center justify-center px-2.5 py-0.5 bg-[#e60012] text-white font-black text-xs tracking-wide p5-skew-l shadow-[2px_2px_0_#000] truncate active:scale-95"
                      >
                        <span className="p5-unskew-l truncate">
                          {row.name}
                        </span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleCopy(row.text, row.id)}
                      className="px-2 py-1 text-[11px] font-black text-white bg-black active:bg-white active:text-black shadow-[1px_1px_0_#000] shrink-0 inline-flex items-center gap-1 p5-skew-l"
                    >
                      <span className="p5-unskew-l flex items-center gap-1">
                        {copiedId === row.id ? (
                          <>
                            <Check className="w-3 h-3 text-[#e60012]" />
                            <span className="text-[#e60012]">已复制</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-zinc-400" />
                            <span>复制</span>
                          </>
                        )}
                      </span>
                    </button>
                  </div>

                  {/* Card Body: Material Recipes */}
                  <div className="pt-2">
                    <div className="text-[10px] text-zinc-400 font-mono font-bold mb-1.5">
                      合成素材:
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {row.materials.map((mat, mIdx) => {
                        const matMeta = PERSONA_META[mat.name];
                        return (
                          <React.Fragment key={`${mat.name}-${mIdx}`}>
                            {mIdx > 0 && (
                              <span className="text-[#e60012] font-black text-xs px-0.5">
                                ×
                              </span>
                            )}
                            <button
                              onClick={() => setInspectedPersona(mat.name)}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-black active:bg-[#e60012] text-white shadow-[1px_1px_0_#000] p5-skew-l"
                            >
                              <span className="p5-unskew-l flex items-center gap-1 text-[11px]">
                                {matMeta && (
                                  <span className="bg-white text-black px-1 py-0 text-[9px] font-black">
                                    {matMeta.arcana}
                                  </span>
                                )}
                                <span className="font-bold text-zinc-100">
                                  {mat.name}
                                </span>
                                <span className="font-mono text-[#e60012] font-black text-[10px]">
                                  Lv{mat.level}
                                </span>
                              </span>
                            </button>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* DESKTOP TABLE VIEW (电脑端保持高对比度表格，md及以上显示) */}
        {/* ============================================================ */}
        <div className="hidden md:block relative bg-[#121218] shadow-[8px_8px_0_#000] p5-cut-card">
          
          {/* Table Top Info Banner */}
          <div className="bg-[#181822] px-5 py-2.5 flex items-center justify-between border-b-2 border-[#e60012]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#e60012] p5-skew-l inline-block" />
              <span className="text-xs font-black uppercase text-white tracking-widest italic">
                PERSONA 5 STRIKERS DATABASE
              </span>
            </div>
            <div className="text-xs text-zinc-300 font-mono font-bold">
              显示 <strong className="text-white font-black">{filteredRows.length}</strong> / 共 {FUSION_ROWS.length} 条记录
            </div>
          </div>

          {/* 表格专属滚动区域：最大高度 72vh，表头 sticky top-0 完美冻结在表体正上方 */}
          <div className="overflow-x-auto max-h-[72vh] overflow-y-auto">
            <table className="w-full text-left border-collapse table-fixed">
              <colgroup>
                <col className="w-20" />
                <col className="w-16" />
                <col className="w-36" />
                <col />
                <col className="w-20" />
              </colgroup>

              {/* 冻结表头：sticky top-0 纯黑高对比度底色 */}
              <thead className="sticky top-0 z-20 shadow-[0_4px_6px_rgba(0,0,0,0.9)]">
                <tr className="bg-[#0b0b0e] text-white text-xs font-black uppercase tracking-wider border-b-2 border-white/20">
                  <th
                    onClick={() => handleSortToggle('arcana')}
                    className="py-2.5 px-3 text-center cursor-pointer hover:text-[#e60012] transition-colors select-none"
                  >
                    <div className="inline-flex items-center justify-center gap-1">
                      <span>塔罗牌</span>
                      <ArrowUpDown className="w-3 h-3 text-[#e60012]" />
                    </div>
                  </th>

                  <th
                    onClick={() => handleSortToggle('level')}
                    className="py-2.5 px-2 text-center cursor-pointer hover:text-[#e60012] transition-colors select-none"
                  >
                    <div className="inline-flex items-center justify-center gap-1">
                      <span>Lv</span>
                      <ArrowUpDown className="w-3 h-3 text-[#e60012]" />
                    </div>
                  </th>

                  <th
                    onClick={() => handleSortToggle('name')}
                    className="py-2.5 px-4 text-center cursor-pointer hover:text-[#e60012] transition-colors select-none"
                  >
                    <div className="inline-flex items-center justify-center gap-1">
                      <span>面具名称</span>
                      <ArrowUpDown className="w-3 h-3 text-[#e60012]" />
                    </div>
                  </th>

                  <th className="py-2.5 px-4 text-left">
                    <span>合成材料明细 (Materials)</span>
                  </th>

                  <th className="py-2.5 px-3 text-right">
                    <span>操作</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5 text-sm">
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-zinc-400 font-medium">
                      <div className="text-base text-white font-black mb-1">未检索到匹配的人格面具资料</div>
                      <p className="text-xs text-zinc-400">请尝试切换搜索关键字或重置塔罗牌筛选</p>
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row, idx) => (
                    <tr
                      key={row.id}
                      className={`hover:bg-[#1c1c26] transition-colors group ${
                        idx % 2 === 0 ? 'bg-[#101015]' : 'bg-[#14141b]'
                      }`}
                    >
                      {/* Arcana */}
                      <td className="py-2 px-3 font-black text-center whitespace-nowrap">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-black bg-white text-black p5-skew-l shadow-[2px_2px_0_#000]">
                          <span className="p5-unskew-l">{row.arcana}</span>
                        </span>
                      </td>

                      {/* Level */}
                      <td className="py-2 px-2 text-center whitespace-nowrap">
                        <span className="font-mono font-black text-white bg-black px-1.5 py-0.5 text-xs inline-block shadow-[1px_1px_0_#000]">
                          Lv.{row.level}
                        </span>
                      </td>

                      {/* Persona Name */}
                      <td className="py-2 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => setInspectedPersona(row.name)}
                          className="inline-flex items-center justify-center px-3 py-1 bg-[#e60012] hover:bg-white text-white hover:text-black font-black text-xs sm:text-sm tracking-wide p5-skew-l shadow-[3px_3px_0_#000] transition-all hover:scale-105"
                        >
                          <span className="p5-unskew-l">
                            {row.name}
                          </span>
                        </button>
                      </td>

                      {/* Materials List */}
                      <td className="py-2 px-4 text-left">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {row.materials.map((mat, mIdx) => {
                            const matMeta = PERSONA_META[mat.name];
                            return (
                              <React.Fragment key={`${mat.name}-${mIdx}`}>
                                {mIdx > 0 && (
                                  <span className="text-[#e60012] font-black text-sm px-0.5">
                                    ×
                                  </span>
                                )}
                                <button
                                  onClick={() => setInspectedPersona(mat.name)}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-black hover:bg-[#e60012] text-white hover:text-white transition-colors shadow-[2px_2px_0_#000] p5-skew-l group/mat"
                                >
                                  <span className="p5-unskew-l flex items-center gap-1 text-xs">
                                    {matMeta && (
                                      <span className="bg-white text-black px-1 py-0 text-[10px] font-black">
                                        {matMeta.arcana}
                                      </span>
                                    )}
                                    <span className="font-bold text-zinc-100 group-hover/mat:text-white">
                                      {mat.name}
                                    </span>
                                    <span className="font-mono text-[#e60012] group-hover/mat:text-white font-black text-[11px]">
                                      Lv{mat.level}
                                    </span>
                                  </span>
                                </button>
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </td>

                      {/* Copy Action */}
                      <td className="py-2 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleCopy(row.text, row.id)}
                          title="复制合成公式"
                          className="px-2 py-0.5 text-xs font-black text-white hover:text-black bg-black hover:bg-white shadow-[2px_2px_0_#000] transition-colors inline-flex items-center gap-1 p5-skew-l"
                        >
                          <span className="p5-unskew-l flex items-center gap-1">
                            {copiedId === row.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-[#e60012]" />
                                <span className="text-[#e60012] text-[11px]">已复制</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-zinc-300" />
                                <span className="text-[11px]">复制</span>
                              </>
                            )}
                          </span>
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Bottom Status */}
          <div className="bg-[#0b0b0e] px-5 py-2.5 flex items-center justify-between text-xs text-zinc-300 border-t border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#e60012] inline-block" />
              <span>提示：点击任意红底面具名或材料名，即可展开该面具的双向合成明细</span>
            </div>
            <div className="font-mono font-bold text-zinc-400">
              PERSONA 5 STRIKERS COMPENDIUM
            </div>
          </div>

        </div>

      </main>

      {/* QUICK PERSONA INSPECTION MODAL (移动端全屏友好与自适应 padding) */}
      {inspectedPersona && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-sm animate-fadeIn"
          onClick={() => setInspectedPersona(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-[#121218] p-4 sm:p-6 shadow-[6px_6px_0_#000] sm:shadow-[10px_10px_0_#000] p5-cut-card max-h-[92vh] sm:max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Red Bar Decor */}
            <div className="absolute top-0 left-0 right-0 h-1.5 sm:h-2 bg-[#e60012]" />

            {/* Close Button */}
            <button
              onClick={() => setInspectedPersona(null)}
              className="absolute top-3 right-3 sm:top-3.5 sm:right-4 p-1 text-white bg-black hover:bg-[#e60012] active:bg-[#e60012] shadow-[2px_2px_0_#000] transition-colors p5-skew-l"
            >
              <span className="p5-unskew-l">
                <X className="w-4 h-4" />
              </span>
            </button>

            {/* Modal Title Banner */}
            <div className="border-b-2 border-[#e60012] pb-2.5 sm:pb-3 mb-3 sm:mb-3.5">
              <div className="flex items-center gap-2 mb-1">
                {inspectedMeta && (
                  <span className="px-2 py-0.5 text-[10px] sm:text-xs font-black bg-white text-black p5-skew-l shadow-[2px_2px_0_#000]">
                    <span className="p5-unskew-l">{inspectedMeta.arcana}</span>
                  </span>
                )}
                <span className="bg-black text-white font-mono font-black text-[10px] sm:text-xs px-2 py-0.5 shadow-[1px_1px_0_#000]">
                  Lv.{inspectedMeta?.level}
                </span>
              </div>
              <div className="inline-block bg-[#e60012] text-white px-3 py-1 p5-skew-l shadow-[3px_3px_0_#000]">
                <h2 className="p5-unskew-l text-lg sm:text-xl font-black italic tracking-wide">
                  {inspectedPersona}
                </h2>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto space-y-3.5 sm:space-y-4 flex-1 pr-1">
              
              {/* How to synthesize this persona (Upstream) */}
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider mb-2 flex items-center gap-1.5 sm:gap-2">
                  <span className="w-2 h-3.5 bg-[#e60012] inline-block p5-skew-l" />
                  如何合成 {inspectedPersona} ({inspectedAsTargetRecipes.length}条配方)
                </h3>
                {inspectedAsTargetRecipes.length === 0 ? (
                  <div className="p-2.5 sm:p-3 bg-black text-xs text-zinc-400 font-bold shadow-[2px_2px_0_#000]">
                    此面具为初始面具或基础面具，暂无前置直接合成公式。
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {inspectedAsTargetRecipes.map((r, i) => (
                      <div
                        key={i}
                        className="p-2 bg-[#0b0b0e] text-xs flex items-center justify-between shadow-[2px_2px_0_#000]"
                      >
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-mono text-white bg-black px-1.5 py-0.5 font-black text-[10px] sm:text-[11px] shrink-0">
                            #{i + 1}
                          </span>
                          {r.materials.map((m, mi) => {
                            const mMeta = PERSONA_META[m.name];
                            return (
                              <React.Fragment key={mi}>
                                {mi > 0 && <span className="text-[#e60012] font-black">×</span>}
                                <button
                                  onClick={() => setInspectedPersona(m.name)}
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-black active:bg-[#e60012] text-white transition-colors shadow-[2px_2px_0_#000] p5-skew-l"
                                >
                                  <span className="p5-unskew-l flex items-center gap-1 text-[11px]">
                                    {mMeta && (
                                      <span className="bg-white text-black px-1 py-0 text-[9px] font-black">
                                        {mMeta.arcana}
                                      </span>
                                    )}
                                    <span className="font-bold text-zinc-100">
                                      {m.name}
                                    </span>
                                    <span className="font-mono text-[#e60012] font-black text-[10px]">
                                      Lv{m.level}
                                    </span>
                                  </span>
                                </button>
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* What can this persona fuse into (Downstream) */}
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider mb-2 flex items-center gap-1.5 sm:gap-2">
                  <span className="w-2 h-3.5 bg-white inline-block p5-skew-l" />
                  可作为原料合成的面具 ({inspectedAsMaterialRecipes.length}条路线 · 按等级由低到高)
                </h3>
                {inspectedAsMaterialRecipes.length === 0 ? (
                  <div className="p-2.5 sm:p-3 bg-black text-xs text-zinc-400 font-bold shadow-[2px_2px_0_#000]">
                    暂无登记作为原料的合成记录。
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {inspectedAsMaterialRecipes.map((r, i) => {
                      const tMeta = PERSONA_META[r.name];
                      return (
                        <div
                          key={i}
                          className="p-2 bg-[#0b0b0e] text-xs flex flex-col md:flex-row md:items-center gap-2 md:gap-4 shadow-[2px_2px_0_#000]"
                        >
                          {/* 目标面具列 */}
                          <div className="w-full md:w-56 shrink-0 flex items-center gap-2">
                            {tMeta && (
                              <span className="shrink-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-black bg-white text-black p5-skew-l shadow-[1px_1px_0_#000] min-w-[36px] text-center">
                                <span className="p5-unskew-l">{tMeta.arcana}</span>
                              </span>
                            )}
                            <button
                              onClick={() => setInspectedPersona(r.name)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#e60012] active:bg-white text-white active:text-black font-black text-xs p5-skew-l shadow-[2px_2px_0_#000] transition-colors"
                            >
                              <span className="p5-unskew-l flex items-center gap-1">
                                <span>{r.name}</span>
                                <span className="font-mono text-[10px]">Lv.{tMeta?.level || r.level}</span>
                              </span>
                            </button>
                          </div>

                          {/* 材料对齐区域 */}
                          <div className="flex-1 flex flex-wrap items-center gap-1.5 text-xs border-t md:border-t-0 pt-1.5 md:pt-0 border-white/5">
                            <span className="text-[10px] sm:text-[11px] text-zinc-400 font-mono font-bold mr-1 shrink-0">
                              材料:
                            </span>
                            {r.materials.map((m, mIdx) => {
                              const isCurrent = m.name === inspectedPersona;
                              const mMeta = PERSONA_META[m.name];
                              return (
                                <React.Fragment key={mIdx}>
                                  {mIdx > 0 && (
                                    <span className="text-[#e60012] font-black text-xs px-0.5">
                                      ×
                                    </span>
                                  )}
                                  <button
                                    onClick={() => setInspectedPersona(m.name)}
                                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 transition-colors shadow-[1px_1px_0_#000] p5-skew-l ${
                                      isCurrent
                                        ? 'bg-[#e60012] text-white font-black'
                                        : 'bg-black active:bg-[#e60012] text-zinc-200 active:text-white'
                                    }`}
                                  >
                                    <span className="p5-unskew-l flex items-center gap-1 text-[11px]">
                                      {mMeta && (
                                        <span className={`px-1 py-0 text-[9px] font-black ${
                                          isCurrent ? 'bg-black text-white' : 'bg-white text-black'
                                        }`}>
                                          {mMeta.arcana}
                                        </span>
                                      )}
                                      <span className="font-bold">
                                        {m.name}
                                      </span>
                                      <span className={`font-mono font-black text-[10px] ${
                                        isCurrent ? 'text-white' : 'text-[#e60012]'
                                      }`}>
                                        Lv{m.level}
                                      </span>
                                    </span>
                                  </button>
                                </React.Fragment>
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
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-10 sm:mt-16 text-center text-[11px] sm:text-xs text-zinc-400 pt-6 px-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#e60012] p5-skew-l inline-block" />
          <span className="font-black text-white tracking-widest uppercase">
            PERSONA 5 STRIKERS COMPENDIUM
          </span>
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#e60012] p5-skew-l inline-block" />
        </div>
        <p className="text-zinc-500 font-bold">
          女神异闻录5S· 全人格面具等级与合成路线资料总表
        </p>
      </footer>

    </div>
  );
}
