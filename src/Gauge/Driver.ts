import { IDriver } from '../Interfaces/IDriver';
import { IGradient } from '../Interfaces/IGradient';
import { IFont } from '../Interfaces/IFont';
import { Util } from '../Common/Util';

// example driver for html canvas implementation.
// "ctx" is our drawing context

export class Driver implements IDriver {
    private ctx: CanvasRenderingContext2D;
    private width: number;
    private height: number;

    constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        // workaround to undo pseudo-transparency caused by anti-aliasing
        this.ctx.translate(0.5, 0.5);
    }

    fillCanvas(gradient: IGradient): void {
        const ctxGradient = gradient.radial ? 
            this.ctx.createRadialGradient(gradient.x0, gradient.y0, gradient.r0, gradient.x1, gradient.y1, gradient.r1) : 
            this.ctx.createLinearGradient(gradient.x0, gradient.y0, gradient.x1, gradient.y1);
        gradient.colorStops.forEach(stop => {
            ctxGradient.addColorStop(stop.offset, stop.color);
        })
        this.ctx.fillStyle = ctxGradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawLine(x0: number, y0: number, x1: number, y1: number, color: string, thickness: number): void {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = thickness;
        this.ctx.globalAlpha = 1;
        this.ctx.moveTo(x0, y0);
        this.ctx.lineTo(x1, y1);
        this.ctx.stroke();
    }

    drawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, color: string, thickness: number): void {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = thickness;
        this.ctx.arc(x, y, radius, Util.d2r(startAngle), Util.d2r(endAngle), false);
        this.ctx.stroke();
    }

    writeText(x: number, y: number, font: IFont, color: string, text: string): void {
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.font = `${font.weight} ${font.fontsize} ${font.typename}`;
        this.ctx.fillText(text, x, y);
    }
}
