import React from 'react';
import { ARCANA_COLOR_MAP } from '../data/personaData';

interface Props {
  arcana: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  skew?: boolean;
}

export const ArcanaBadge: React.FC<Props> = ({ arcana, size = 'sm', className = '', skew = true }) => {
  const sizeClass = 
    size === 'lg' ? 'px-2.5 py-1 text-xs font-bold tracking-wider' :
    size === 'md' ? 'px-2 py-0.5 text-xs font-semibold' :
    'px-1.5 py-0.5 text-[11px] font-bold';

  return (
    <span
      className={`inline-flex items-center gap-1 uppercase select-none rounded-none border border-zinc-700 bg-zinc-900/90 text-zinc-200 ${sizeClass} ${
        skew ? 'p5-skew-l shadow-[1px_1px_0px_rgba(0,0,0,0.8)]' : ''
      } ${className}`}
    >
      <span className={skew ? 'p5-unskew-l inline-block' : 'inline-block'}>
        {arcana}
      </span>
    </span>
  );
};
