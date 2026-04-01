import { motion } from 'framer-motion';
import type { ChangeEvent } from 'react';

interface ControlsProps {
  draftRows: number;
  draftCols: number;
  pattern: number;
  isPlaying: boolean;
  onRowsChange: (value: number) => void;
  onColsChange: (value: number) => void;
  onApplySize: () => void;
  onTogglePattern: () => void;
  onReset: () => void;
}

const Controls = ({
  draftRows,
  draftCols,
  pattern,
  isPlaying,
  onRowsChange,
  onColsChange,
  onApplySize,
  onTogglePattern,
  onReset,
}: ControlsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="grid gap-4 rounded-[30px] border border-white/10 bg-slate-950/70 p-5 shadow-[0_0_60px_rgba(56,189,248,0.12)]"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-slate-300">
          Rows
          <input
            type="number"
            min={10}
            max={30}
            value={draftRows}
            onChange={(event: ChangeEvent<HTMLInputElement>) => onRowsChange(Number(event.target.value))}
            className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400/80"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-300">
          Columns
          <input
            type="number"
            min={10}
            max={30}
            value={draftCols}
            onChange={(event: ChangeEvent<HTMLInputElement>) => onColsChange(Number(event.target.value))}
            className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400/80"
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={onApplySize}
          className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          Apply size
        </button>
        <button
          type="button"
          onClick={onTogglePattern}
          className="rounded-2xl border border-white/15 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/50"
        >
          Pattern {pattern === 1 ? '1 — Balanced' : '2 — Challenge'}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20"
          disabled={!isPlaying}
        >
          Reset Game
        </button>
      </div>
      <p className="text-xs text-slate-500">Tip: Use 10–30 for the best performance on desktop and mobile.</p>
    </motion.div>
  );
};

export default Controls;
