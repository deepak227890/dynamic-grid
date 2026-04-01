import { motion } from 'framer-motion';

interface HUDProps {
  lives: number;
  timer: number;
  score: number;
  totalBlue: number;
}

const HUD = ({ lives, timer, score, totalBlue }: HUDProps) => {
  const hearts = Array.from({ length: 5 }, (_, index) => index < lives);
  const timerPercent = Math.max(0, Math.min(100, (timer / 30) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="grid gap-4 rounded-[30px] border border-white/10 bg-slate-950/70 p-5 shadow-[0_0_60px_rgba(14,165,233,0.12)]"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-2xl bg-slate-900/80 px-4 py-3 text-sm text-slate-300 shadow-inner">
          <span className="mr-3 text-xs uppercase tracking-[0.24em] text-cyan-300">Lives</span>
          <div className="flex gap-1">
            {hearts.map((active, index) => (
              <span key={index} className={active ? 'text-rose-400' : 'text-slate-700'}>
                {active ? '❤️' : '♡'}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-slate-900/80 px-4 py-3 text-sm text-slate-300 shadow-inner">
          <span className="text-xs uppercase tracking-[0.24em] text-cyan-300">Timer</span>
          <div className="min-w-[90px] text-right text-lg font-semibold text-white">{timer}s</div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-slate-900/80 px-4 py-3 text-sm text-slate-300 shadow-inner">
          <span className="text-xs uppercase tracking-[0.24em] text-cyan-300">Score</span>
          <div className="text-lg font-semibold text-white">{score}/{totalBlue}</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-500">
          <span>Round energy</span>
          <span>{timerPercent.toFixed(0)}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
          <motion.div
            initial={false}
            animate={{ width: `${timerPercent}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default HUD;
