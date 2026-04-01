import { memo } from 'react';
import { motion } from 'framer-motion';
import type { TileState } from '../types';

interface TileProps {
  tile: TileState;
  onClick: (id: string) => void;
}

const colorMap = {
  blue: 'from-cyan-400 to-blue-600 shadow-cyan-500/40',
  red: 'from-rose-500 to-pink-600 shadow-rose-500/40',
  green: 'from-emerald-400 to-lime-500 shadow-emerald-500/35',
} as const;

const Tile = ({ tile, onClick }: TileProps) => {
  const isBlue = tile.type === 'blue';
  const isRed = tile.type === 'red';
  const isCollected = tile.collected;
  const baseClasses = [
    'group relative overflow-hidden rounded-2xl border border-white/10 p-1 transition-all duration-300',
    'shadow-neon',
    isCollected ? 'scale-90 opacity-70' : 'hover:-translate-y-0.5 hover:shadow-xl',
  ].join(' ');

  const tileClasses = [
    'relative flex h-full w-full items-center justify-center rounded-[18px]',
    'bg-gradient-to-br text-slate-950',
    colorMap[tile.type],
    isCollected && 'from-slate-400 to-slate-600',
  ]
    .filter(Boolean)
    .join(' ');

  const ringClasses = isRed ? 'ring-2 ring-rose-300/40' : isBlue ? 'ring-2 ring-cyan-300/30' : 'ring-2 ring-emerald-300/30';

  return (
    <motion.button
      type="button"
      onClick={() => onClick(tile.id)}
      disabled={isCollected}
      whileHover={{ scale: isCollected ? 1 : 1.03 }}
      whileTap={{ scale: isCollected ? 1 : 0.96 }}
      className={baseClasses}
      aria-label={`Tile ${tile.type}${isCollected ? ' collected' : ''}`}
    >
      <motion.div
        className={`${tileClasses} ${ringClasses}`}
        animate={tile.flash ? { opacity: [1, 0.2, 1] } : undefined}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      >
        {isCollected ? (
          <span className="text-lg font-semibold text-slate-950">✓</span>
        ) : isBlue ? (
          <span className="text-sm uppercase tracking-[0.22em] text-slate-950">collect</span>
        ) : isRed ? (
          <span className="text-sm uppercase tracking-[0.22em] text-slate-950">danger</span>
        ) : (
          <span className="text-sm uppercase tracking-[0.22em] text-slate-950">safe</span>
        )}
      </motion.div>
    </motion.button>
  );
};

export default memo(Tile);
