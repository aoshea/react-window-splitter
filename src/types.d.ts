export interface Dimension {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type UseDimensions = [(node: HTMLDivElement) => void, Dimension];
