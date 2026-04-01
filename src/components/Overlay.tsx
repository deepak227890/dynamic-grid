import { AnimatePresence, motion } from 'framer-motion';

interface OverlayProps {
  status: 'playing' | 'won' | 'lost' | 'transition';
  pattern: number;
  onRestart: () => void;
}

const Overlay = ({ status, pattern, onRestart }: OverlayProps) => {
  return (
    <AnimatePresence>
      {status !== 'playing' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/90 p-5"
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-lg rounded-[36px] border border-cyan-400/20 bg-slate-900/95 p-8 text-center shadow-[0_0_80px_rgba(56,189,248,0.18)]"
          >
            <div className="mb-6 text-sm uppercase tracking-[0.28em] text-cyan-300">{status === 'won' ? 'Victory' : status === 'lost' ? 'Game Over' : 'Transition'}</div>
            <h2 className="mb-4 text-3xl font-semibold text-white">
              {status === 'won'
                ? 'You won!'
                : status === 'lost'
                ? "You've run out of time or lives."
                : `Pattern ${pattern} complete!`}
            </h2>
            <p className="mb-8 text-slate-400">
              {status === 'won'
                ? 'Score achieved. Start a new game when you are ready.'
                : status === 'lost'
                ? 'Reset the board and try a new strategy. Every round feels fresher.'
                : 'Shifting into the next layout. Stay sharp as the grid evolves.'}
            </p>
            <button
              type="button"
              onClick={onRestart}
              className="inline-flex items-center justify-center rounded-2xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              {status === 'lost' ? 'Restart Game' : status === 'won' ? 'Start New Game' : 'Continue'}
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default Overlay;
