export type TileType = 'blue' | 'red' | 'green';

export interface TileState {
  id: string;
  type: TileType;
  collected: boolean;
  flash?: boolean;
}

export type PatternId = 1 | 2;
