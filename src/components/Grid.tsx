import { AnimatePresence, motion } from 'framer-motion';
import Tile from './Tile';
import type { TileState } from '../types';

interface GridProps {
  tiles: TileState[];
  rows: number;
  cols: number;
  onTileClick: (id: string) => void;
  loading: boolean;
}

const Grid = ({ tiles, rows, cols, onTileClick, loading }: GridProps) => {
  const style = {
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
  } as const;

  return (
    <div className="relative w-full overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/70 shadow-[0_0_80px_rgba(14,165,233,0.11)]">
      <AnimatePresence initial={false} mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid gap-3 p-4 sm:p-6"
            style={style}
          >
            {Array.from({ length: rows * cols }).map((_, index) => (
              <div
                key={`loading-${index}`}
                className="h-16 rounded-2xl bg-slate-800/80 animate-pulse sm:h-20"
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35 }}
            className="grid gap-3 p-4 sm:p-6"
            style={style}
          >
            {tiles.map((tile) => (
              <Tile key={tile.id} tile={tile} onClick={onTileClick} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Grid;
