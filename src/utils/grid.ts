import type { PatternId, TileState } from '../types';

// Return a random integer between min and max, inclusive.
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = <T,>(array: T[]) => {
  const cloned = [...array];
  for (let i = cloned.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
};

// Build a tile distribution array based on the requested ratios.
const buildBaseDistribution = (count: number, blueRatio: number, redRatio: number) => {
  const blueCount = Math.max(1, Math.round(count * blueRatio));
  const redCount = Math.round(count * redRatio);
  const greenCount = count - blueCount - redCount;
  return [
    ...Array(blueCount).fill('blue' as const),
    ...Array(redCount).fill('red' as const),
    ...Array(greenCount).fill('green' as const),
  ];
};

const buildTileArray = (rows: number, cols: number, types: readonly TileState['type'][]): TileState[] => {
  return types.map((type, index) => ({
    id: `${type}-${index}-${rows}x${cols}`,
    type,
    collected: false,
  }));
};

// Create a more challenging pattern for Pattern 2 using red barriers and blue pockets.
const createChallengingLayout = (rows: number, cols: number) => {
  const total = rows * cols;
  const tileGrid: TileState['type'][] = Array(total).fill('green');

  const addRedWall = (isRow: boolean, offset: number) => {
    for (let i = 0; i < (isRow ? cols : rows); i++) {
      const row = isRow ? offset : i;
      const col = isRow ? i : offset;
      const index = row * cols + col;
      if (Math.random() > 0.18) {
        tileGrid[index] = 'red';
      }
    }
  };

  addRedWall(true, Math.max(2, Math.floor(rows * 0.28)));
  addRedWall(false, Math.max(2, Math.floor(cols * 0.35)));
  addRedWall(true, Math.min(rows - 3, Math.floor(rows * 0.62)));

  const blueCount = Math.max(1, Math.round(total * 0.15));
  const clusterCenters = [
    { row: Math.floor(rows * 0.2), col: Math.floor(cols * 0.75) },
    { row: Math.floor(rows * 0.7), col: Math.floor(cols * 0.25) },
  ];

  let placedBlue = 0;
  const placeBlueAround = (row: number, col: number) => {
    const positions = [
      [row, col],
      [row - 1, col],
      [row + 1, col],
      [row, col - 1],
      [row, col + 1],
    ];
    for (const [r, c] of positions) {
      if (placedBlue >= blueCount) break;
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        const idx = r * cols + c;
        if (tileGrid[idx] !== 'red') {
          tileGrid[idx] = 'blue';
          placedBlue += 1;
        }
      }
    }
  };

  clusterCenters.forEach(({ row, col }) => placeBlueAround(row, col));

  while (placedBlue < blueCount) {
    const row = randomInt(1, rows - 2);
    const col = randomInt(1, cols - 2);
    const idx = row * cols + col;
    if (tileGrid[idx] === 'green') {
      tileGrid[idx] = 'blue';
      placedBlue += 1;
    }
  }

  const redCountTarget = Math.max(1, Math.round(total * 0.24));
  const currentRed = tileGrid.filter((type) => type === 'red').length;
  const redSlots = shuffle(tileGrid
    .map((type, index) => (type === 'green' ? index : -1))
    .filter((index) => index >= 0));

  for (let i = 0; i < redCountTarget - currentRed && i < redSlots.length; i += 1) {
    tileGrid[redSlots[i]] = 'red';
  }

  return tileGrid;
};

// Generate the final grid shape for a given pattern ID.
export const generateGrid = (rows: number, cols: number, pattern: PatternId): TileState[] => {
  const area = rows * cols;
  if (pattern === 1) {
    const types = shuffle(buildBaseDistribution(area, 0.18, 0.16));
    return buildTileArray(rows, cols, types);
  }

  const patternTypes = createChallengingLayout(rows, cols);
  const filled = patternTypes.map((type) => type as TileState['type']);
  const missing = rows * cols - filled.length;
  if (missing > 0) {
    filled.push(...Array(missing).fill('green'));
  }

  return buildTileArray(rows, cols, filled);
};
