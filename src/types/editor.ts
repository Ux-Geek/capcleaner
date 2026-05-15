export type RemovalMode = "blur" | "crop";

export interface RemovalBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  mode: RemovalMode;
}

export interface VideoDimensions {
  width: number;
  height: number;
}
