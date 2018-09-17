
import { Driver } from './Driver';
import { IDriver } from '../Interfaces/IDriver';
import { IGradient } from '../Interfaces/IGradient';
import { IFont } from '../Interfaces/IFont';

// Middleware file to integrate gauge logic with underlying driver implementations
export class Canvas {
    private ctx: any; // this will change depending on driver
    private width: number;
    private height: number;
    private driver: IDriver;

    constructor(ctx: any, width: number, height: number) {
        this.width = width;
        this.height = height;
        this.driver = new Driver(ctx, width, height);
    }

    // fill background
    fillCanvas(gradient: IGradient): void {
        this.driver.fillCanvas(gradient);
    }
    
    drawLine(x0: number, y0: number, x1: number, y1: number, color: string, thickness: number): void {
        this.driver.drawLine(x0, y0, x1, y1, color, thickness);
    }

    drawArc(x: number, y: number, radius: number, startAngle: number, endAngle, color: string, thickness: number): void {
        this.driver.drawArc(Math.round(x), Math.round(y), Math.ceil(radius), startAngle, endAngle, color, Math.ceil(thickness));
    }

    writeText(x: number, y: number, font: IFont, color: string, text: string): void {
        this.driver.writeText(x, y, font, color, text);
    }
}
