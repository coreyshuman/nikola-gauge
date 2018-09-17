import { IColorStop } from './IColorStop';

export interface IGradient {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    radial: boolean;
    r0?: number;
    r1?: number;
    colorStops: IColorStop[];
    addColorStop(offset: number, color: string);
}