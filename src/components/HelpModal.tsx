import React, { useState } from 'react';
import {
  X,
  BookOpen,
  History,
  Sparkles,
  Search,
  Route,
  Layers,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Copy,
  SlidersHorizontal,
  Mail,
  Check,
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPathFinder?: () => void;
}

export function HelpModal({ isOpen, onClose, onOpenPathFinder }: HelpModalProps) {
  const [activeTab, setActiveTab] = useState<'guide' | 'changelog'>('guide');
  const [emailCopied, setEmailCopied] = useState<boolean>(false);

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText('akatsuki_w@qq.com');
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#0f1118] text-white w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[8px_8px_0_#000] border-2 border-white/20 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top P5 Red Accent Bar */}
        <div className="h-1.5 bg-[#e60012] w-full" />

        {/* Modal Header */}
        <div className="px-4 sm:px-6 pt-4 pb-3 border-b border-white/10 flex items-center justify-between gap-3 bg-[#141622]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 bg-[#e60012] text-white flex items-center justify-center p5-skew-l shadow-[2px_2px_0_#000] shrink-0">
              <span className="p5-unskew-l">
                <BookOpen className="w-4 h-4 text-white" />
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  使用指南 & 更新日志
                </h3>
                <span className="text-[10px] font-mono font-black bg-[#e60012] text-white px-1.5 py-0.2 shadow-[1px_1px_0_#000]">
                  v1.2.0
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-bold truncate">
                Persona 5 Strikers · 合体全书操作手册与功能指引
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-black hover:bg-[#e60012] text-zinc-300 hover:text-white border border-white/20 hover:border-white transition-colors p5-skew-l shadow-[1.5px_1.5px_0_#000] cursor-pointer shrink-0"
            title="关闭窗口"
          >
            <span className="p5-unskew-l">
              <X className="w-4 h-4" />
            </span>
          </button>
        </div>

        {/* Tab Switchers */}
        <div className="px-4 sm:px-6 pt-3 pb-2 bg-[#0c0e14] border-b border-white/10 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 sm:px-4 py-1.5 text-xs font-black p5-skew-l transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'bg-[#e60012] text-white border border-[#ff4d59] shadow-[2px_2px_0_#000]'
                : 'bg-[#141622] hover:bg-[#1a1d2e] text-zinc-400 hover:text-white border border-white/15'
            }`}
          >
            <span className="p5-unskew-l flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>操作指南</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('changelog')}
            className={`px-3 sm:px-4 py-1.5 text-xs font-black p5-skew-l transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'changelog'
                ? 'bg-[#e60012] text-white border border-[#ff4d59] shadow-[2px_2px_0_#000]'
                : 'bg-[#141622] hover:bg-[#1a1d2e] text-zinc-400 hover:text-white border border-white/15'
            }`}
          >
            <span className="p5-unskew-l flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" />
              <span>更新日志</span>
              <span className="w-1.5 h-1.5 bg-[#ffe57f] rounded-full inline-block animate-pulse" />
            </span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm">
          {activeTab === 'guide' ? (
            <div className="space-y-4">
              {/* Feature 1: Search & Filter */}
              <div className="bg-[#141622] border border-white/10 p-3.5 shadow-[2px_2px_0_#000] relative">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 bg-[#e60012] text-white flex items-center justify-center font-mono font-bold text-xs p5-skew-l shrink-0">
                    <span className="p5-unskew-l">1</span>
                  </span>
                  <h4 className="font-black text-sm text-white flex items-center gap-1.5">
                    <Search className="w-4 h-4 text-[#ffe57f]" />
                    <span>检索与定位：按面具、材料与塔罗牌筛选</span>
                  </h4>
                </div>
                <div className="text-zinc-300 space-y-1.5 pl-7 leading-relaxed">
                  <p>
                    • <strong className="text-white">智能多维搜索</strong>：输入面具中文名、素材名或阿尔卡那关键字，即时过滤对应面具。
                  </p>
                  <p>
                    • <strong className="text-white">塔罗牌分类</strong>：点击上方 22 张大阿尔卡那按键（如愚者、魔术师、女教皇），即可只查看对应分类。
                  </p>
                  <p>
                    • <strong className="text-white">等级阶梯索引</strong>：点击 <span className="text-[#ffe57f] font-mono">Lv1 ~ Lv67</span> 索引按键，页面将平滑滚轴直达该等级区间。
                  </p>
                </div>
              </div>

              {/* Feature 2: Material Badge Click & Drilldown */}
              <div className="bg-[#141622] border border-white/10 p-3.5 shadow-[2px_2px_0_#000]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 bg-[#e60012] text-white flex items-center justify-center font-mono font-bold text-xs p5-skew-l shrink-0">
                    <span className="p5-unskew-l">2</span>
                  </span>
                  <h4 className="font-black text-sm text-white flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#ffe57f]" />
                    <span>材料穿透反查：点击任意材料查看详情</span>
                  </h4>
                </div>
                <div className="text-zinc-300 space-y-1.5 pl-7 leading-relaxed">
                  <p>
                    • 网页中所有出现的材料标签（如 <span className="bg-[#0e1017] px-1 py-0.2 border border-white/20 text-white font-mono text-[11px] inline-block">[愚者] 恶灵军团 Lv34</span>）均可直接点击。
                  </p>
                  <p>
                    • 点击后立即弹窗展开该面具的【成名合成配方】与【可作为材料合成的下游面具】，支持递归无限连点反查。
                  </p>
                </div>
              </div>

              {/* Feature 3: Path Finder */}
              <div className="bg-[#141622] border-2 border-[#e60012]/40 p-3.5 shadow-[2px_2px_0_#000]">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-[#e60012] text-white flex items-center justify-center font-mono font-bold text-xs p5-skew-l shrink-0">
                      <span className="p5-unskew-l">3</span>
                    </span>
                    <h4 className="font-black text-sm text-white flex items-center gap-1.5">
                      <Route className="w-4 h-4 text-[#ffe57f]" />
                      <span>合成路径寻路器：跨阶梯图遍历计算</span>
                    </h4>
                  </div>
                  {onOpenPathFinder && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenPathFinder();
                      }}
                      className="text-[10px] font-bold bg-[#e60012] hover:bg-white text-white hover:text-black px-2 py-0.5 p5-skew-l transition-colors cursor-pointer flex items-center gap-0.5 shrink-0"
                    >
                      <span className="p5-unskew-l flex items-center gap-0.5">
                        立即体验 ➔
                      </span>
                    </button>
                  )}
                </div>
                <div className="text-zinc-300 space-y-1.5 pl-7 leading-relaxed">
                  <p>
                    • 点击顶部红框按钮【合成路径寻路器】，任意选择手中已有的「起始面具」和想合成的「目标面具」。
                  </p>
                  <p>
                    • 算法引擎会在毫秒级内自动穷举图谱，输出步数最少、消耗最低的连环合成路径。
                  </p>
                  <p>
                    • 切换【仅初始等级】按键，可一键排除需要练级的前置材料，获得零门槛现成合成方案。
                  </p>
                </div>
              </div>

              {/* Feature 4: Level Mechanics Explanation */}
              <div className="bg-[#141622] border border-white/10 p-3.5 shadow-[2px_2px_0_#000]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 bg-[#e60012] text-white flex items-center justify-center font-mono font-bold text-xs p5-skew-l shrink-0">
                    <span className="p5-unskew-l">4</span>
                  </span>
                  <h4 className="font-black text-sm text-white flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-[#ffe57f]" />
                    <span>等级与“▲需练级”机制说明</span>
                  </h4>
                </div>
                <div className="text-zinc-300 space-y-1.5 pl-7 leading-relaxed">
                  <p>
                    • <strong className="text-white">初始等级（Base Level）</strong>：该面具在图鉴中初次获得时的原始默认等级。
                  </p>
                  <p>
                    • <strong className="text-[#ffe57f]">Lv▲需练级</strong>：当材料标识中出现金黄三角（如 <span className="text-[#f6c344] font-mono font-bold">Lv34▲</span>），说明在游戏内进行此项合成时，该素材面具必须预先练级升到对应等级才能满足触发公式。
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Tab 2: Changelog Timeline */
            <div className="space-y-4">
              {/* Version 1.2.0 */}
              <div className="bg-[#141622] border-l-4 border-[#e60012] p-3.5 shadow-[2px_2px_0_#000] space-y-2">
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#e60012] text-white font-mono font-black text-xs px-2 py-0.5 p5-skew-l shadow-[1px_1px_0_#000]">
                      <span className="p5-unskew-l">v1.2.0</span>
                    </span>
                    <span className="font-black text-white text-xs sm:text-sm">
                      智能路径寻路器与排版调优
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">
                    当前最新版
                  </span>
                </div>
                <ul className="text-zinc-300 space-y-1.5 text-xs pl-2 leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#e60012] font-black shrink-0">✦</span>
                    <span><strong>上线「合成路径寻路器」</strong>：支持任意起点与目标面具的最优跨级合成链求解。</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#e60012] font-black shrink-0">✦</span>
                    <span><strong>方案一键切换</strong>：提供「全部方案」与「仅初始等级」双模式，精准免除练级前置。</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#e60012] font-black shrink-0">✦</span>
                    <span><strong>移动端排版重构</strong>：两面具合成单行利落并排，三面具自适应平滑折行。</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#e60012] font-black shrink-0">✦</span>
                    <span><strong>字型与排版清晰度修复</strong>：塔罗牌微标采用高清抗锯齿加粗，消除字迹发糊。</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#e60012] font-black shrink-0">✦</span>
                    <span><strong>新增使用指南与更新日志弹窗</strong>：内置完整怪盗全书操作手册。</span>
                  </li>
                </ul>
              </div>

              {/* Version 1.1.0 */}
              <div className="bg-[#141622] border-l-4 border-white/30 p-3.5 shadow-[2px_2px_0_#000] space-y-2 opacity-90">
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-black text-white font-mono font-black text-xs px-2 py-0.5 p5-skew-l border border-white/20">
                      <span className="p5-unskew-l">v1.1.0</span>
                    </span>
                    <span className="font-bold text-white text-xs sm:text-sm">
                      材料无限穿透反查与练级预警
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">
                    前期版本
                  </span>
                </div>
                <ul className="text-zinc-400 space-y-1.5 text-xs pl-2 leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <span className="text-zinc-400 font-bold shrink-0">•</span>
                    <span><strong>材料穿透反查</strong>：点击任意素材即刻弹窗查看其来源与去向。</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-zinc-400 font-bold shrink-0">•</span>
                    <span><strong>练级前置提示</strong>：引入 Lv▲ 警示标与悬浮说明，明确合成所需练级门槛。</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-zinc-400 font-bold shrink-0">•</span>
                    <span><strong>公式一键复制</strong>：支持单个配方一键写入剪贴板。</span>
                  </li>
                </ul>
              </div>

              {/* Version 1.0.0 */}
              <div className="bg-[#141622] border-l-4 border-white/20 p-3.5 shadow-[2px_2px_0_#000] space-y-2 opacity-75">
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-black text-zinc-400 font-mono font-black text-xs px-2 py-0.5 p5-skew-l border border-white/10">
                      <span className="p5-unskew-l">v1.0.0</span>
                    </span>
                    <span className="font-bold text-zinc-300 text-xs sm:text-sm">
                      P5S 合体全书初始数据库发布
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">
                    初始版本
                  </span>
                </div>
                <ul className="text-zinc-400 space-y-1.5 text-xs pl-2 leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <span className="text-zinc-500 font-bold shrink-0">•</span>
                    <span>建立 P5S 全 67 款人格面具及 368 条精确合体配方全息数据库。</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-zinc-500 font-bold shrink-0">•</span>
                    <span>适配 Persona 5 经典怪盗黑红切角视觉风格，支持塔罗牌与等级检索。</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar - Persona 5 Stylized Footer */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#11131c] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
          {/* Left: Feedback & Meta block */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
            {/* Title / Brand Tag */}
            <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider shrink-0 select-none">
              <span className="w-1.5 h-1.5 bg-[#e60012] rotate-45 shrink-0" />
              <span className="text-zinc-300 font-bold">P5S 合体全书</span>
              <span className="text-zinc-600 hidden sm:inline">|</span>
            </div>

            {/* Feedback badge with 1-click copy */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-zinc-400 font-bold shrink-0">意见与反馈:</span>
              <button
                type="button"
                onClick={handleCopyEmail}
                title="点击直接复制真实邮箱 (akatsuki_w@qq.com)"
                className="group/mail inline-flex items-center gap-1.5 bg-black hover:bg-[#1a1d2e] active:scale-95 text-zinc-300 hover:text-white px-2 py-0.5 border border-white/15 hover:border-[#e60012] p5-skew-l shadow-[1px_1px_0_#000] transition-all cursor-pointer text-[10.5px] font-mono"
              >
                <span className="p5-unskew-l flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-[#e60012] group-hover/mail:text-white transition-colors shrink-0" />
                  <span className="font-bold text-zinc-200 group-hover/mail:text-white tracking-tight">
                    akatsuki_w<span className="text-[#ffe57f]">#</span>qq.com
                  </span>
                  <span className="text-[9px] text-zinc-400 group-hover/mail:text-zinc-300 bg-white/5 px-1 py-0.2 border border-white/10 flex items-center gap-0.5">
                    {emailCopied ? (
                      <span className="text-[#23c36b] font-bold flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" /> 已复制!
                      </span>
                    ) : (
                      <span># → @ 点击复制</span>
                    )}
                  </span>
                </span>
              </button>
            </div>
          </div>

          {/* Right: Close Action Button */}
          <div className="flex items-center justify-end shrink-0">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-1.5 bg-[#e60012] hover:bg-white text-white hover:text-black font-black text-xs p5-skew-l shadow-[2px_2px_0_#000] border border-[#ff4d59] hover:border-white transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:scale-95"
            >
              <span className="p5-unskew-l flex items-center justify-center gap-1">
                <span>关闭窗口</span>
                <span className="text-[10px]">✕</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
