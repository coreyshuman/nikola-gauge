import { IGradient } from '../Interfaces/IGradient';
import { LinearGradient } from '../Gradient/Gradient';
import { IFont } from '../Interfaces/IFont';
import { Font } from '../Font/Font';
import { Tuple } from '../Common/Tuple';
import { Util } from '../Common/Util';
import { Canvas } from './Canvas';
import { Timer } from '../Common/Timer';

export default class Gauge {
    static readonly RingGraphColor = '#fe9440';
    static readonly TextColor = '#eeeeee';
    static readonly BackColor1 = '#fe5c00';
    static readonly BackColor2 = '#000000';
    static readonly LineColor = '#fe9440';
    static readonly GreenColor = '#5a9132';
    static readonly RedColor = '#a32c08';
    static readonly TargetColor = '#eeeeee';
    private canvas: Canvas;
    private width: number;
    private height: number;
    private gradient: IGradient;
    private font: IFont;
    private value: number;
    private lastValueUpdateTick: number;
    private minimum: number;
    private maximum: number;
    private targetMinimum: number;
    private targetMaximum: number;
    private ringGraphOrigin: Tuple<number>;
    private ringGraphRadius: number;
    private ringGraphAngleRange: Tuple<number>;
    private ringGraphLabelCount: number;
    private ringGraphUnitLabel: string;
    private ringGraphDisplayedValue: number;
    private ringGraphValueIncrementInterval: number;
    private ringGraphAnimationTimer: Timer;
    private lineGraphOrigin: Tuple<number>;
    private lineGraphLength: number;
    private LineColor: string;
    private lineGraphThickness: number;
    private lineGraphValue: number;
    private lineGraphDisplayValues: number[];
    private lineGraphDisplayValueCount: number;
    private lineGraphUpdateInterval: number;
    private lineGraphMaxHeight: number;
    private lineGraphCenterValue: number;
    private lineGraphMaxMagnitude: number;
    private lineGraphUseAutoSize: boolean;
    private lineGraphUpdateTimer: Timer;

    constructor(ctx: any, width: number, height: number) {
        this.width = width;
        this.height = height;
        this.canvas = new Canvas(ctx, width, height);
        // animation config
        this.ringGraphDisplayedValue = 0;
        this.value = 0;
        this.lastValueUpdateTick = Timer.getTicks();
        this.minimum = 0;
        this.maximum = 200;
        this.targetMinimum = 90;
        this.targetMaximum = 110;
        this.ringGraphValueIncrementInterval = 1;
        this.ringGraphAnimationTimer = new Timer(15);
        this.ringGraphAnimationTimer.EventHandler = this.ringGraphAnimationEventHandler.bind(this);
        // default the gauge background
        this.gradient = new LinearGradient(0, this.height, this.width, 0);
        this.gradient.addColorStop(0, Gauge.BackColor1);
        this.gradient.addColorStop(.8, Gauge.BackColor2);
        // default font style
        this.font = new Font('Arial', `${Math.ceil(this.width * 12/260)}px`, 'lighter');
        // default ringGraph graph settings
        this.ringGraphAngleRange = new Tuple<number>(-145, 55);
        this.ringGraphLabelCount = 5;
        this.ringGraphOrigin = new Tuple<number>(this.width * 0.4, this.height * 0.55);
        this.ringGraphRadius = this.width * 0.4;
        this.ringGraphUnitLabel = 'Watts';
        // default line graph settings
        this.lineGraphOrigin = new Tuple<number>(this.width * 0.1, this.height * 0.55);
        this.lineGraphLength = this.width * 0.6;
        this.lineGraphThickness = 1; //Math.ceil(this.width * (2 / 260));
        this.lineGraphMaxHeight = this.height * 0.2;
        this.lineGraphMaxMagnitude = (this.maximum - this.minimum) / 2;
        this.lineGraphCenterValue = this.maximum - ((this.maximum - this.minimum) / 2);
        this.lineGraphUpdateInterval = 2000;
        this.lineGraphUpdateTimer = new Timer(this.lineGraphUpdateInterval);
        this.lineGraphUpdateTimer.EventHandler = this.lineGraphUpdateEventHandler.bind(this);
        this.lineGraphUpdateTimer.Enabled = true;
        // setup line graph values
        this.lineGraphValue = 0;
        this.lineGraphDisplayValueCount = Math.round(this.lineGraphLength);
        this.lineGraphDisplayValues = [];

        this.draw();
    }

    get BackgroundGradient(): IGradient {
        return this.gradient;
    }
    set BackgroundGradient(gradient: IGradient) {
        this.gradient = gradient;
    }

    get Font(): IFont {
        return this.font;
    }

    set Font(font: IFont) {
        this.font = font;
    }

    get RingGraphUnitLabel(): string {
        return this.ringGraphUnitLabel;
    }

    set RingGraphUnitLabel(label: string) {
        this.ringGraphUnitLabel = label;
    }

    get Value(): number {
        return this.value;
    }

    set Value(value: number) {
        this.updateLineGraphAverageValue();
        this.value = value;
        this.ringGraphAnimationTimer.Enabled = true;
    }

    get Minimum(): number {
        return this.minimum;
    }

    set Minimum(value: number) {
        this.minimum = value;
        this.ringGraphAnimationTimer.Enabled = true;
    }

    get Maximum(): number {
        return this.maximum;
    }

    set Maximum(value: number) {
        this.maximum = value;
        this.ringGraphAnimationTimer.Enabled = true;
    }

    get TargetMinimum(): number {
        return this.targetMinimum;
    }

    set TargetMinimum(value: number) {
        this.targetMinimum = value;
        this.ringGraphAnimationTimer.Enabled = true;
    }

    get TargetMaximum(): number {
        return this.targetMaximum;
    }

    set TargetMaximum(value: number) {
        this.targetMaximum = value;
        this.ringGraphAnimationTimer.Enabled = true;
    }

    get MaximumMagnutide(): number {
        return this.lineGraphMaxMagnitude;
    }

    set MaximumMagnutide(value: number) {
        this.lineGraphMaxMagnitude = value;
        this.ringGraphAnimationTimer.Enabled = true;
    }

    get CenterValue(): number {
        return this.lineGraphCenterValue;
    }

    set CenterValue(value: number) {
        this.lineGraphCenterValue = value;
        this.ringGraphAnimationTimer.Enabled = true;
    }

    private ringGraphAnimationEventHandler(): void {
        this.updateRingGraph();
        this.draw();
    }

    private lineGraphUpdateEventHandler(): void {
        this.updateLineGraph();
        this.draw();
    }

    private updateLineGraphAverageValue(): void {
        this.lineGraphValue += this.value * Timer.getTicksDiff(this.lastValueUpdateTick);
        this.lastValueUpdateTick = Timer.getTicks();
    }

    private clearLineGraphAverageValue(): void {
        this.lineGraphValue = 0;
        this.lastValueUpdateTick = Timer.getTicks();
    }

    private updateLineGraph(): void {
        this.updateLineGraphAverageValue();
        this.lineGraphDisplayValues.unshift(this.lineGraphValue / this.lineGraphUpdateInterval);
        this.clearLineGraphAverageValue();
        if(this.lineGraphDisplayValues.length > this.lineGraphDisplayValueCount) {
            this.lineGraphDisplayValues.pop();
        }
    }

    private updateRingGraph(): void {
        this.value = Gauge.getBoundValue(new Tuple<number>(this.minimum, this.maximum), this.value);
        if(this.ringGraphDisplayedValue != this.value) {
            let sign: number = (this.value < this.ringGraphDisplayedValue) ? -1 : 1;
            let interval: number = this.ringGraphValueIncrementInterval * sign;
            this.ringGraphDisplayedValue += interval;
        } else {
            this.ringGraphAnimationTimer.Enabled = false;
        }
        if(this.ringGraphDisplayedValue < this.minimum || this.ringGraphDisplayedValue > this.maximum) {
            this.ringGraphDisplayedValue = this.value;
        }
        if(Math.abs(this.ringGraphDisplayedValue - this.value) < this.ringGraphValueIncrementInterval) {
            this.ringGraphDisplayedValue = this.value;
        }
    }

    private draw(): void {
        this.clear();
        this.drawCircleMeter();
        this.drawLineGraph();
    }
    
    // clear canvas and draw base (fixed) Gauge elements
    private clear(): void {
        this.canvas.fillCanvas(this.gradient);
    }

    private drawCircleMeter(): void {
        const firstLabelValue: number = Gauge.getNearest10th(this.minimum);
        const ringGraphValueIncrement: number = Gauge.getRingLabelIncrement(new Tuple<number>(this.minimum, this.maximum), this.ringGraphLabelCount);
        const ringGraphAngleIncrement: number = (this.ringGraphAngleRange.v2 - this.ringGraphAngleRange.v1) / this.ringGraphLabelCount;
        const ringGraphDisplayValue: number = Gauge.getAngleFromValue(this.ringGraphAngleRange, new Tuple<number>(this.minimum, this.maximum), this.ringGraphDisplayedValue);
        const ringGraphDisplayColor: string = Gauge.getRingColor(new Tuple<number>(this.minimum, this.maximum), this.ringGraphDisplayedValue);
        const ringGraphTargetLowAngle: number = Gauge.getAngleFromValue(this.ringGraphAngleRange, new Tuple<number>(this.minimum, this.maximum), this.targetMaximum);
        const ringGraphTargetHightAngle: number = Gauge.getAngleFromValue(this.ringGraphAngleRange, new Tuple<number>(this.minimum, this.maximum), this.targetMinimum);
        // draw ring graph target area, background, and value arcs.
        this.canvas.drawArc(this.ringGraphOrigin.v1, this.ringGraphOrigin.v2, this.ringGraphRadius, ringGraphTargetLowAngle, ringGraphTargetHightAngle, Gauge.TargetColor, this.width * (9 / 260));
        this.canvas.drawArc(this.ringGraphOrigin.v1, this.ringGraphOrigin.v2, this.ringGraphRadius, this.ringGraphAngleRange.v1, this.ringGraphAngleRange.v2, ringGraphDisplayColor, this.width * (5 / 260));
        this.canvas.drawArc(this.ringGraphOrigin.v1, this.ringGraphOrigin.v2, this.ringGraphRadius, this.ringGraphAngleRange.v1, ringGraphDisplayValue, '#000', this.width * (3 / 260));
        // draw ringGraph labels
        this.canvas.writeText(this.width * 0.82, this.height * 0.9, this.font, Gauge.TextColor, this.ringGraphUnitLabel);
        for(let i = 0; i < this.ringGraphLabelCount; i ++) {
            const label = (firstLabelValue + ringGraphValueIncrement * i).toString();
            const labelLocation: Tuple<number> = Gauge.getRingLabelLocation(this.ringGraphOrigin, this.ringGraphRadius * 1.125, this.ringGraphAngleRange.v2 - (ringGraphAngleIncrement * i));
            this.canvas.writeText(labelLocation.v1, labelLocation.v2, this.font, Gauge.TextColor, label);
        }
    }

    

    private drawLineGraph(): void {
        this.canvas.drawLine(this.lineGraphOrigin.v1, this.lineGraphOrigin.v2, this.lineGraphOrigin.v1 + this.lineGraphLength, this.lineGraphOrigin.v2, Gauge.LineColor, this.lineGraphThickness);
        let prevPoint: Tuple<number> = null;

        this.lineGraphDisplayValues.forEach((displayValue, index) => {
            const x = this.lineGraphOrigin.v1 + this.lineGraphLength - index;
            displayValue = Gauge.getBoundValue(new Tuple<number>(this.lineGraphCenterValue - this.lineGraphMaxMagnitude, this.lineGraphCenterValue + this.lineGraphMaxMagnitude), displayValue);
            const graphOffset = Gauge.getLineOffsetFromValue(this.lineGraphMaxHeight, this.lineGraphMaxMagnitude, this.lineGraphCenterValue, displayValue);
            console.log(displayValue, graphOffset);
            const y = this.lineGraphOrigin.v2 - graphOffset; // invert so up is positive
            if(prevPoint !== null) {
                const fillColor: string = (displayValue > this.targetMaximum || displayValue < this.targetMinimum) ? Gauge.RedColor : Gauge.GreenColor;
                console.log(displayValue, this.targetMaximum, this.targetMinimum, fillColor === Gauge.RedColor ? 'red': 'green')
                this.canvas.drawLine(x, this.lineGraphOrigin.v2, x, y, fillColor, 1);
                this.canvas.drawLine(prevPoint.v1, prevPoint.v2, x, y, Gauge.LineColor, this.lineGraphThickness);
            }
            prevPoint = new Tuple<number>(x, y);
        });
        // draw target lines
        const targetMaxOffset = Gauge.getLineOffsetFromValue(this.lineGraphMaxHeight, this.lineGraphMaxMagnitude, this.lineGraphCenterValue, this.targetMaximum);
        const targetMinOffset = Gauge.getLineOffsetFromValue(this.lineGraphMaxHeight, this.lineGraphMaxMagnitude, this.lineGraphCenterValue, this.targetMinimum);
        this.canvas.drawLine(this.lineGraphOrigin.v1, this.lineGraphOrigin.v2 + targetMaxOffset, this.lineGraphOrigin.v1 + this.lineGraphLength, this.lineGraphOrigin.v2 + targetMaxOffset, Gauge.TargetColor, 1);
        this.canvas.drawLine(this.lineGraphOrigin.v1, this.lineGraphOrigin.v2 + targetMinOffset, this.lineGraphOrigin.v1 + this.lineGraphLength, this.lineGraphOrigin.v2 + targetMinOffset, Gauge.TargetColor, 1);
    }

    static getBoundValue(minMax: Tuple<number>, value) {
        if(value > minMax.v2) {
            return minMax.v2;
        }
        if(value < minMax.v1) {
            return minMax.v1;
        }
        return value;
    }

    static getLineOffsetFromValue(maxHeight: number, maxMagnitude: number, centerValue: number, value: number): number {
        return (value - centerValue) * (maxHeight / maxMagnitude);
    }

    static getAngleFromValue(angleRange: Tuple<number>, valueRange: Tuple<number>, value: number): number {
        return (valueRange.v2 - value) * (angleRange.v2 - angleRange.v1 ) / (valueRange.v2 - valueRange.v1) + angleRange.v1;
    }
    static getRingColor(ringGraphValueRange: Tuple<number>, value: number) {
        const range: number = ringGraphValueRange.v2 - ringGraphValueRange.v1;
        let color: string = Gauge.RingGraphColor;
        value = value + ringGraphValueRange.v1;

        if(value < range * 0.2) {
            color = Gauge.RedColor;
        } else if (value > range * 0.8) {
            color = Gauge.GreenColor;
        } 
        return color;
    }
    static getRingLabelLocation(origin: Tuple<number>, radius: number, angle: number) : Tuple<number> {
        const x: number = radius * Math.cos(Util.d2r(angle)) + origin.v1;
        const y: number = radius * Math.sin(Util.d2r(angle)) + origin.v2;
        return new Tuple<number>(x,y);
    }

    static getRingLabelIncrement(ringGraphValueRange: Tuple<number>, ringGraphLabelCount: number): number {
        const range: number = ringGraphValueRange.v2 - ringGraphValueRange.v1;
        let increment: number = range / ringGraphLabelCount;
        increment = Gauge.getNearest10th(increment);
        return increment;
    }

    static getNearest10th(value: number): number {
        return Math.round(value / 10) * 10;
    }

    
}