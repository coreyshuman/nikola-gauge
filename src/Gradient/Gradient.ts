import { IGradient } from '../Interfaces/IGradient';
import { IColorStop } from '../Interfaces/IColorStop';

export class LinearGradient implements IGradient {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    radial: boolean;
    colorStops: IColorStop[];

    constructor(x0: number, y0: number, x1: number, y1: number) {
        this.x0 = x0;
        this.y0 = y0;
        this.x1 = x1;
        this.y1 = y1;
        this.radial = false;
        this.colorStops = new Array<ColorStop>();
    }

    addColorStop(offset: number, color: string) {
        this.colorStops.push(new ColorStop(offset, color));
    }
}

export class ColorStop implements IColorStop {
    offset: number;
    color: string;
    constructor(offset:number, color: string) {
        this.offset = offset;
        this.color = color;
        if(this.offset < 0) {
            offset = 0;
            console.warn('Offset cannot be less than 0. Defaulting to 0.');
        }
        if(this.offset > 1) {
            offset = 1;
            console.warn('Offset cannot be greater than 1. Defaulting to 1.');
        }
    }
}