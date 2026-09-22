import React, { useState, useMemo } from 'react';
import { FUSION_ROWS, PERSONA_META, ARCANA_ORDER } from '../data/personaData';
import { ArcanaBadge } from './ArcanaBadge';
import { Search, Filter, ArrowUpDown, ExternalLink, Copy, Check, Sparkles, Layers } from 'lucide-react';
import { FusionRow } from '../types';

interface Props {
  onSelectPersonaForTree: (name: string) => void;
  onInspectPersona: (name: string) => void;
}

export const PersonaDatabaseTable: React.FC<Props> = ({
  onSelectPersonaForTree,
  onInspectPersona,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArcana, setSelectedArcana] = useState('ALL');
  const [sortField, setSortField] = useState<'level' | 'arcana' | 'name'>('level');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<'flat' | 'grouped'>('flat');

  // Filter and sort the raw recipes
  const filteredRows = useMemo(() => {
    let result = FUSION_ROWS.filter((row) => {
      const matchesArcana = selectedArcana === 'ALL' || row.arcana === selectedArcana;
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !term ||
        row.name.toLowerCase().includes(term) ||
        row.arcana.toLowerCase().includes(term) ||
        row.text.toLowerCase().includes(term) ||
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

  // Grouped by Persona
  const groupedData = useMemo(() => {
    const map = new Map<string, FusionRow[]>();
    for (const row of filteredRows) {
      if (!map.has(row.name)) {
        map.set(row.name, []);
      }
      map.get(row.name)!.push(row);
    }
    return Array.from(map.entries()).map(([name, recipes]) => ({
      name,
      arcana: recipes[0].arcana,
      level: recipes[0].level,
      recipes,
    }));
  }, [filteredRows]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleSortToggle = (field: 'level' | 'arcana' | 'name') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Top Banner with P5R aesthetics */}
      <div className="relative bg-gradient-to-r from-[#121217] via-[#1a1a24] to-[#121217] border-2 border-zinc-700 p-5 p5-clip-corner shadow-[6px_6px_0_#000]">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#e60012]" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#e60012] text-white text-xs font-black px-2 py-0.5 p5-skew-l">
                <span className="p5-unskew-l">P5R COMPENDIUM</span>
              </span>
              <h2 className="text-2xl font-black italic tracking-wide text-white">
                全人格面具合体数据表
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              还原游戏全书数据库，支持快速检索、按塔罗牌阿尔卡那分类、材料联动与一键跳转树状图
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 bg-black/60 p-1 border border-zinc-800 self-start">
            <button
              onClick={() => setDisplayMode('flat')}
              className={`px-3 py-1 text-xs font-black transition-all flex items-center gap-1.5 ${
                displayMode === 'flat'
                  ? 'bg-[#e60012] text-white shadow-[2px_2px_0_#000]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              清单明细模式 ({filteredRows.length}条)
            </button>
            <button
              onClick={() => setDisplayMode('grouped')}
              className={`px-3 py-1 text-xs font-black transition-all flex items-center gap-1.5 ${
                displayMode === 'grouped'
                  ? 'bg-[#e60012] text-white shadow-[2px_2px_0_#000]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              面具聚合模式 ({groupedData.length}体)
            </button>
          </div>
        </div>

        {/* Search and Filters Toolbar */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-8 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索面具名称、材料名、塔罗牌（如：亚森、杰克灯笼、死神）..."
              className="w-full bg-[#0b0b0e] text-white pl-10 pr-4 py-2.5 text-sm border-2 border-zinc-700 focus:border-[#e60012] focus:outline-none transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
              >
                清除
              </button>
            )}
          </div>

          {/* Quick Sort Dropdown */}
          <div className="sm:col-span-4 flex gap-2">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              className="flex-1 bg-[#0b0b0e] text-zinc-200 px-3 py-2 text-sm border-2 border-zinc-700 focus:border-[#e60012] focus:outline-none"
            >
              <option value="level">排序：等级 Lv</option>
              <option value="arcana">排序：塔罗牌 Arcana</option>
              <option value="name">排序：面具名称 Name</option>
            </select>
            <button
              onClick={() => setSortAsc(!sortAsc)}
              title={sortAsc ? '升序' : '降序'}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white border-2 border-zinc-700 font-bold text-xs flex items-center"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span className="ml-1 text-xs">{sortAsc ? '升序' : '降序'}</span>
            </button>
          </div>
        </div>

        {/* Arcana Quick Filter Tags */}
        <div className="mt-3 flex items-center gap-1.5 flex-wrap pt-3 border-t border-zinc-800">
          <span className="text-[11px] text-zinc-400 font-bold uppercase mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#e60012]" /> 塔罗牌:
          </span>
          <button
            onClick={() => setSelectedArcana('ALL')}
            className={`px-2 py-0.5 text-xs font-bold transition-colors ${
              selectedArcana === 'ALL'
                ? 'bg-[#e60012] text-white shadow-[2px_2px_0_#000]'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            全部 ({FUSION_ROWS.length})
          </button>
          {ARCANA_ORDER.map((arc) => {
            const isSel = selectedArcana === arc;
            const count = FUSION_ROWS.filter((r) => r.arcana === arc).length;
            if (count === 0) return null;
            return (
              <button
                key={arc}
                onClick={() => setSelectedArcana(arc)}
                className={`px-2 py-0.5 text-xs font-bold transition-all border ${
                  isSel
                    ? 'bg-[#e60012] text-white border-white shadow-[2px_2px_0_#000]'
                    : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white'
                }`}
              >
                {arc} <span className="text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Main Table Layout */}
      {displayMode === 'flat' ? (
        <div className="overflow-x-auto border-2 border-zinc-800 bg-[#0d0d12] shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#181820] text-white border-b-2 border-[#e60012] uppercase tracking-wider text-xs font-black">
                <th
                  onClick={() => handleSortToggle('arcana')}
                  className="py-3 px-4 w-32 cursor-pointer hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>塔罗牌</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSortToggle('level')}
                  className="py-3 px-4 w-20 cursor-pointer hover:bg-zinc-800 transition-colors text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Lv</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSortToggle('name')}
                  className="py-3 px-4 w-44 cursor-pointer hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>面具名称</span>
                    <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                  </div>
                </th>
                <th className="py-3 px-4">合成材料 (点击材料可穿透查询)</th>
                <th className="py-3 px-4 w-28 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-sm">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500 font-medium">
                    没有找到符合条件的面具合成数据。请尝试其他搜索词或重置塔罗牌筛选。
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, idx) => {
                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-[#1f1f28]/80 transition-colors ${
                        idx % 2 === 0 ? 'bg-[#101015]' : 'bg-[#14141b]'
                      }`}
                    >
                      {/* Arcana Column */}
                      <td className="py-2.5 px-4 font-bold">
                        <ArcanaBadge arcana={row.arcana} />
                      </td>

                      {/* Level Column */}
                      <td className="py-2.5 px-4 text-center">
                        <span className="font-mono font-black text-amber-400 bg-black/40 px-2 py-0.5 border border-zinc-800 text-xs">
                          Lv.{row.level}
                        </span>
                      </td>

                      {/* Target Persona Column */}
                      <td className="py-2.5 px-4">
                        <button
                          onClick={() => onSelectPersonaForTree(row.name)}
                          className="font-black text-white hover:text-[#e60012] transition-colors flex items-center gap-1.5 text-base tracking-wide group"
                        >
                          <span>{row.name}</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#e60012]" />
                        </button>
                      </td>

                      {/* Materials Formula Column */}
                      <td className="py-2.5 px-4">
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
                                  onClick={() => onInspectPersona(mat.name)}
                                  className="inline-flex items-center gap-1.5 px-2 py-1 bg-zinc-900 hover:bg-[#252533] border border-zinc-700 hover:border-[#e60012] transition-colors rounded-none group"
                                >
                                  {matMeta && (
                                    <span className="text-[10px] text-zinc-400 font-bold group-hover:text-amber-300">
                                      〖{matMeta.arcana}〗
                                    </span>
                                  )}
                                  <span className="font-bold text-zinc-200 group-hover:text-white">
                                    {mat.name}
                                  </span>
                                  <span className="text-[11px] font-mono text-[#e60012] font-bold">
                                    Lv{mat.level}
                                  </span>
                                </button>
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="py-2.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleCopy(row.text, row.id)}
                            title="复制合成公式"
                            className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 transition-colors"
                          >
                            {copiedId === row.id ? (
                              <Check className="w-3.5 h-3.5 text-green-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => onSelectPersonaForTree(row.name)}
                            className="px-2 py-1 text-xs font-black bg-[#e60012] hover:bg-red-600 text-white transition-colors p5-skew-l"
                          >
                            <span className="p5-unskew-l inline-block">树状图</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grouped View by Persona */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groupedData.map((group) => {
            return (
              <div
                key={group.name}
                className="bg-[#121218] border-2 border-zinc-800 hover:border-[#e60012] transition-colors p-4 relative shadow-[4px_4px_0_#000] group"
              >
                <div className="flex items-start justify-between gap-2 border-b border-zinc-800 pb-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <ArcanaBadge arcana={group.arcana} />
                      <h3 className="text-xl font-black italic text-white group-hover:text-[#e60012] transition-colors">
                        {group.name}
                      </h3>
                    </div>
                    <div className="text-xs text-zinc-400 mt-1 flex items-center gap-2">
                      <span className="font-mono text-amber-400 font-bold">等级 Lv.{group.level}</span>
                      <span>·</span>
                      <span>共 {group.recipes.length} 种直接合成配方</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectPersonaForTree(group.name)}
                    className="px-3 py-1.5 text-xs font-black bg-[#e60012] hover:bg-red-600 text-white p5-skew-l shadow-[2px_2px_0_#000]"
                  >
                    <span className="p5-unskew-l flex items-center gap-1">
                      路线图谱
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </button>
                </div>

                {/* Recipes list for this Persona */}
                <div className="space-y-2">
                  {group.recipes.map((r, rIdx) => (
                    <div
                      key={r.id}
                      className="bg-black/40 p-2 border border-zinc-800 text-xs flex items-center justify-between gap-2"
                    >
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-mono text-zinc-500 font-bold mr-1">
                          #{rIdx + 1}
                        </span>
                        {r.materials.map((m, mIdx) => (
                          <React.Fragment key={mIdx}>
                            {mIdx > 0 && <span className="text-[#e60012] font-black">×</span>}
                            <button
                              onClick={() => onInspectPersona(m.name)}
                              className="text-zinc-300 hover:text-white underline-offset-2 hover:underline font-bold"
                            >
                              {m.name} <span className="text-[#e60012] font-mono">Lv{m.level}</span>
                            </button>
                          </React.Fragment>
                        ))}
                      </div>
                      <button
                        onClick={() => handleCopy(r.text, r.id)}
                        className="text-zinc-500 hover:text-zinc-300 p-1"
                        title="复制"
                      >
                        {copiedId === r.id ? (
                          <Check className="w-3 h-3 text-green-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer stats badge */}
      <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-800">
        <div>
          当前筛选显示: <span className="text-white font-bold">{filteredRows.length}</span> 条路线 /
          总计 <span className="text-white font-bold">{FUSION_ROWS.length}</span> 条路线
        </div>
        <div className="text-zinc-500">
          点击任意材料即可查看该面具的独立合成路径
        </div>
      </div>

    </div>
  );
};
