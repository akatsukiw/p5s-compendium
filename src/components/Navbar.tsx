import React from 'react';
import { GitBranch, Table, Sparkles, BookOpen } from 'lucide-react';

export type AppTab = 'tree' | 'database' | 'calculator';

interface Props {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  totalPersonas: number;
  totalRecipes: number;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  totalPersonas,
  totalRecipes,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0d]/95 backdrop-blur-md border-b-4 border-[#e60012] shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand in P5 Style */}
          <div className="flex items-center gap-3">
            <div className="relative bg-[#e60012] text-white font-black text-xl px-3 py-1 p5-skew-l shadow-[4px_4px_0_#000] border border-white">
              <span className="p5-unskew-l tracking-tighter italic flex items-center gap-1.5 font-black">
                <Sparkles className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                P5S
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <h1 className="text-xl sm:text-2xl font-black italic tracking-wide text-white drop-shadow-[2px_2px_0_#000]">
                  PERSONA 5S <span className="text-[#e60012] not-italic">合体路线全书</span>
                </h1>
                <span className="hidden sm:inline-block text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 border border-zinc-700">
                  P5R Visual Ver.
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-medium tracking-wide">
                收录 {totalPersonas} 体人格面具 · {totalRecipes} 条合成路线 · 树状图谱与全书数据库
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Skewed P5 button design) */}
          <div className="flex items-center gap-2">
            <button
              id="tab-tree-btn"
              onClick={() => setActiveTab('tree')}
              className={`relative px-4 py-2 text-sm font-black uppercase tracking-wider transition-all p5-skew-l flex items-center gap-2 border-2 ${
                activeTab === 'tree'
                  ? 'bg-[#e60012] text-white border-white shadow-[4px_4px_0_#000]'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-500 hover:text-white'
              }`}
            >
              <span className="p5-unskew-l flex items-center gap-1.5">
                <GitBranch className="w-4 h-4" />
                合成路线与树状图
              </span>
            </button>

            <button
              id="tab-database-btn"
              onClick={() => setActiveTab('database')}
              className={`relative px-4 py-2 text-sm font-black uppercase tracking-wider transition-all p5-skew-l flex items-center gap-2 border-2 ${
                activeTab === 'database'
                  ? 'bg-[#e60012] text-white border-white shadow-[4px_4px_0_#000]'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-500 hover:text-white'
              }`}
            >
              <span className="p5-unskew-l flex items-center gap-1.5">
                <Table className="w-4 h-4" />
                全面具数据总览
              </span>
            </button>

            <button
              id="tab-calc-btn"
              onClick={() => setActiveTab('calculator')}
              className={`relative px-4 py-2 text-sm font-black uppercase tracking-wider transition-all p5-skew-l flex items-center gap-2 border-2 ${
                activeTab === 'calculator'
                  ? 'bg-[#e60012] text-white border-white shadow-[4px_4px_0_#000]'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-500 hover:text-white'
              }`}
            >
              <span className="p5-unskew-l flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                双向合体速查
              </span>
            </button>
          </div>

        </div>
      </div>
      
      {/* P5 Signature Bottom Diagonal Accent */}
      <div className="h-1 bg-gradient-to-r from-[#e60012] via-white to-[#e60012] opacity-80" />
    </header>
  );
};
