import { IGradient } from './IGradient';
import { IFont } from './IFont';

/**
 * this is my test duder
 * 
 */  
export interface IDriver {
        /**
     * this is my test FILLCANVAS
     * 
     */  
    fillCanvas(gradient: IGradient);
    drawLine(x0: number, y0: number, x1: number, y1: number, color: string, thickness: number);
    drawArc(x: number, y: number, radius: number, startAngle: number, endAngle, color: string, thickness: number);
    writeText(x: number, y: number, font: IFont, color: string, text: string);
}