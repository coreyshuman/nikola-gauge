import Gauge from './Gauge/Gauge';
import Tuple from './Common/Tuple';
import Timer from './Common/Timer';
import { Context2DDriver as Driver } from './Drivers/Context2DDriver';

const gauges: Gauge[] = [];
const range: Tuple<number>[] = [new Tuple<number>(0,400), new Tuple<number>(0,200)];
const target: Tuple<number>[] = [new Tuple<number>(100,150), new Tuple<number>(60,110)];
const center: number[] = [125, 85];
const label: string[] = ['Watts', '°C'];

for(let i = 1; i <= 2; i++) {
    const canvas: HTMLCanvasElement = document.getElementById('canvas' + i) as HTMLCanvasElement;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
    const gauge = new Gauge(new Driver(ctx, canvas.width, canvas.height));
    // shrink line graph range to emphasize target zone
    gauge.MaximumMagnutide = (gauge.Maximum - gauge.Minimum) / 4; 
    gauge.Minimum = range[i-1].v1;
    gauge.Maximum = range[i-1].v2;
    gauge.TargetMinimum = target[i-1].v1;
    gauge.TargetMaximum = target[i-1].v2;
    gauge.CenterValue = center[i-1];
    gauge.Value = 100;
    gauge.Label = label[i-1];
    gauges.push(gauge);
}

new Timer(50, () => {
    gauges.forEach(gauge => {
        let newVal = gauge.Value + ((Math.random() - 0.5) * 2);
        if(newVal < gauge.Minimum + 20) newVal += (gauge.Maximum - gauge.Minimum) / 2;
        if(newVal > gauge.Maximum - 20) newVal -= (gauge.Maximum - gauge.Minimum) / 2;
        gauge.Value = newVal;
    });
}, true);
