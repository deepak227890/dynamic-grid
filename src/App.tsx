import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { generateGrid } from './utils/grid';
import type { PatternId, TileState } from './types';
import Controls from './components/Controls';
import Grid from './components/Grid';
import HUD from './components/HUD';
import Overlay from './components/Overlay';

const MIN_SIZE = 10;
const MAX_SIZE = 30;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const createInitialTiles = (rows: number, cols: number, pattern: PatternId) => generateGrid(rows, cols, pattern);

const App = () => {
  const [rows, setRows] = useState(12);
  const [cols, setCols] = useState(12);
  const [pattern, setPattern] = useState<PatternId>(1);
  const [draftRows, setDraftRows] = useState(12);
  const [draftCols, setDraftCols] = useState(12);
  const [tiles, setTiles] = useState<TileState[]>(() => createInitialTiles(12, 12, 1));
  const [lives, setLives] = useState(5);
  const [timer, setTimer] = useState(30);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost' | 'transition'>('playing');
  const [loading, setLoading] = useState(false);

  const totalBlue = useMemo(() => tiles.filter((tile) => tile.type === 'blue').length, [tiles]);
  const collectedBlue = useMemo(
    () => tiles.filter((tile) => tile.type === 'blue' && tile.collected).length,
    [tiles]
  );

  // Play a tiny, subtle audio cue on tile interactions.
  const playSfx = useCallback((type: 'blue' | 'red') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const context = new AudioContext();
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.frequency.value = type === 'blue' ? 440 : 180;
      gain.gain.value = 0.06;
      osc.connect(gain);
      gain.connect(context.destination);
      osc.start();
      osc.stop(context.currentTime + 0.08);
      setTimeout(() => context.close(), 150);
    } catch {
      // Audio may be disabled or blocked; fallback silently.
    }
  }, []);

  // Initialize a new round with optional score and life carry-over.
  const startRound = useCallback(
    (
      nextRows: number,
      nextCols: number,
      nextPattern: PatternId,
      keepScore = false,
      keepLives = false,
      nextStatus: 'playing' | 'won' | 'lost' | 'transition' = 'playing'
    ) => {
      setLoading(true);
      setRows(nextRows);
      setCols(nextCols);
      setDraftRows(nextRows);
      setDraftCols(nextCols);
      setPattern(nextPattern);
      setStatus(nextStatus);
      setTimer(30);
      if (!keepScore) setScore(0);
      if (!keepLives) setLives(5);
      setTimeout(() => {
        setTiles(createInitialTiles(nextRows, nextCols, nextPattern));
        setLoading(false);
      }, 240);
    },
    []
  );

  // Process a tile click: collect blue tiles, damage red tiles, and ignore safe zones.
  const handleTileClick = useCallback(
    (id: string) => {
      if (status !== 'playing') return;
      setTiles((prev) => {
        const tile = prev.find((item) => item.id === id);
        if (!tile || tile.collected) return prev;

        if (tile.type === 'blue') {
          playSfx('blue');
          setScore((value) => value + 1);
          return prev.map((item) => (item.id === id ? { ...item, collected: true } : item));
        }

        if (tile.type === 'red') {
          playSfx('red');
          setLives((value) => Math.max(0, value - 1));
          window.setTimeout(() => {
            setTiles((snapshot) => snapshot.map((item) => (item.id === id ? { ...item, flash: false } : item)));
          }, 320);
          return prev.map((item) => (item.id === id ? { ...item, flash: true } : item));
        }

        return prev;
      });
    },
    [status, playSfx]
  );

  useEffect(() => {
    if (status !== 'playing') return;
    const timerId = window.setInterval(() => {
      setTimer((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timerId);
  }, [status]);

  useEffect(() => {
    if (timer === 0 && status === 'playing') {
      setStatus('lost');
    }
  }, [timer, status]);

  useEffect(() => {
    if (lives === 0 && status === 'playing') {
      setStatus('lost');
    }
  }, [lives, status]);

  useEffect(() => {
    if (status !== 'playing' || totalBlue === 0) return;
    if (collectedBlue === totalBlue) {
      setStatus('won');
    }
  }, [collectedBlue, totalBlue, status]);

  const handleApplySize = () => {
    const nextRows = clamp(draftRows, MIN_SIZE, MAX_SIZE);
    const nextCols = clamp(draftCols, MIN_SIZE, MAX_SIZE);
    startRound(nextRows, nextCols, pattern, false, false, 'playing');
  };

  const handleTogglePattern = () => {
    const nextPattern: PatternId = pattern === 1 ? 2 : 1;
    startRound(rows, cols, nextPattern, false, false, 'playing');
  };

  const handleReset = () => {
    startRound(rows, cols, pattern, false, false, 'playing');
  };

  const handleRestart = () => {
    startRound(12, 12, 1, false, false, 'playing');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_30%),linear-gradient(180deg,_#070b16_0%,_#050611_70%)] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="grid gap-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="rounded-[32px] border border-white/10 bg-slate-950/60 p-6 shadow-[0_0_80px_rgba(56,189,248,0.14)]"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Neon Grid Quest</p>
                <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Collect the blue tiles before time runs out.</h1>
              </div>
              <div className="rounded-3xl bg-slate-900/80 px-5 py-4 text-sm text-slate-300 shadow-inner">
                <p className="font-medium text-cyan-300">Current Pattern</p>
                <p className="mt-2 text-lg text-white">{pattern === 1 ? 'Balanced Sector' : 'Hazard Grid'}</p>
              </div>
            </div>
            <p className="mt-5 max-w-2xl text-slate-400">A polished arcade-style grid game with responsive tile animations, smart pattern switching, and bright neon styling.</p>
          </motion.div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-6">
            <HUD lives={lives} timer={timer} score={score} totalBlue={totalBlue} />
            <Grid tiles={tiles} rows={rows} cols={cols} onTileClick={handleTileClick} loading={loading} />
          </div>
          <Controls
            draftRows={draftRows}
            draftCols={draftCols}
            pattern={pattern}
            isPlaying={status === 'playing'}
            onRowsChange={(value) => setDraftRows(clamp(value, MIN_SIZE, MAX_SIZE))}
            onColsChange={(value) => setDraftCols(clamp(value, MIN_SIZE, MAX_SIZE))}
            onApplySize={handleApplySize}
            onTogglePattern={handleTogglePattern}
            onReset={handleReset}
          />
        </div>
      </div>
      <Overlay status={status} pattern={pattern} onRestart={handleRestart} />
    </div>
  );
};

export default App;
