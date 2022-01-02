
import { IDriver } from '../Interfaces/IDriver';
import { IGradient } from '../Interfaces/IGradient';
import { IFont } from '../Interfaces/IFont';

// Middleware file to integrate gauge logic with underlying driver implementations
export class Canvas {
    private driver: IDriver;

    constructor(driver: IDriver) {
        this.driver = driver;
    }

    get width() {
        return this.driver.width;
    }

    get height() {
        return this.driver.height;
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
