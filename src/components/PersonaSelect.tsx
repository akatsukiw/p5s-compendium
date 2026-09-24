import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, Check, X } from 'lucide-react';
import { PERSONA_META } from '../data/personaData';

interface PersonaSelectProps {
  value: string;
  onChange: (name: string) => void;
  options: string[]; // List of sorted persona names
  label?: string;
  badgeType?: 'START' | 'GOAL';
}

export const PersonaSelect: React.FC<PersonaSelectProps> = ({
  value,
  onChange,
  options,
  badgeType,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedMeta = PERSONA_META[value];

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Filtered options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase().trim();
    return options.filter((name) => {
      const meta = PERSONA_META[name];
      const matchName = name.toLowerCase().includes(q);
      const matchArcana = meta?.arcana.toLowerCase().includes(q);
      const matchLevel = meta ? `lv${meta.level}`.includes(q) || `${meta.level}` === q : false;
      return matchName || matchArcana || matchLevel;
    });
  }, [options, searchQuery]);

  const handleSelect = (name: string) => {
    onChange(name);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#101728] border-2 transition-all p-2 sm:p-2.5 flex items-center justify-between shadow-[2px_2px_0_#000] cursor-pointer group text-left ${
          isOpen
            ? 'border-[#e60012] ring-1 ring-[#e60012]/50'
            : 'border-white/20 hover:border-[#e60012]/80'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Arcana Badge */}
          {selectedMeta && (
            <span className="bg-white text-black text-[10px] font-black px-1.5 py-0.5 p5-skew-l leading-none shrink-0 shadow-[1px_1px_0_#000]">
              <span className="p5-unskew-l">{selectedMeta.arcana}</span>
            </span>
          )}

          {/* Persona Name */}
          <span className="text-xs sm:text-sm font-black text-white truncate tracking-wide">
            {value}
          </span>

          {/* Level Badge */}
          {selectedMeta && (
            <span className="text-[11px] font-mono font-bold text-zinc-400 bg-black/60 px-1.5 py-0.5 border border-white/10 shrink-0 ml-auto">
              Lv.{selectedMeta.level}
            </span>
          )}
        </div>

        {/* Slanted Chevron Arrow */}
        <div className="ml-2 shrink-0 text-zinc-400 group-hover:text-white transition-colors">
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#e60012]' : 'text-zinc-400'
            }`}
          />
        </div>
      </button>

      {/* Dropdown Popup Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#0a0a10] border-2 border-[#e60012] shadow-[0_12px_36px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden animate-fade-in">
          {/* Top Search Input */}
          <div className="p-2 bg-[#12121c] border-b border-white/10 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#e60012] shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索面具名、阿尔卡那或等级..."
              className="w-full bg-transparent text-white text-xs font-bold focus:outline-none placeholder-zinc-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-zinc-400 hover:text-white p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Options List - Increased height to show more personas comfortably */}
          <div
            ref={listRef}
            className="max-h-72 sm:max-h-96 overflow-y-auto custom-scrollbar divide-y divide-white/5 py-1"
          >
            {filteredOptions.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-400">
                未找到匹配的面具
              </div>
            ) : (
              filteredOptions.map((name) => {
                const meta = PERSONA_META[name];
                const isSelected = name === value;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleSelect(name)}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between gap-2 transition-all cursor-pointer group ${
                      isSelected
                        ? 'bg-[#e60012] text-white font-black'
                        : 'hover:bg-[#1a1a26] text-zinc-200 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {/* Level: Neutral Gray */}
                      <span
                        className={`font-mono text-[11px] font-bold px-1 py-0.5 shrink-0 ${
                          isSelected
                            ? 'text-white bg-black/40'
                            : 'text-zinc-400 bg-black/40 group-hover:text-zinc-200'
                        }`}
                      >
                        Lv.{meta?.level ?? '--'}
                      </span>

                      {/* Arcana Pill */}
                      {meta && (
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.5 p5-skew-l leading-none shrink-0 ${
                            isSelected
                              ? 'bg-black text-white'
                              : 'bg-white text-black'
                          }`}
                        >
                          <span className="p5-unskew-l">{meta.arcana}</span>
                        </span>
                      )}

                      {/* Persona Name */}
                      <span className="text-xs font-bold truncate tracking-wide">
                        {name}
                      </span>
                    </div>

                    {/* Selected Checkmark */}
                    {isSelected && (
                      <Check className="w-4 h-4 text-white shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Dropdown Footer info */}
          <div className="px-2.5 py-1 bg-[#06060a] border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
            <span>按等级升序排列</span>
            <span>共 {filteredOptions.length} 款可选</span>
          </div>
        </div>
      )}
    </div>
  );
};
