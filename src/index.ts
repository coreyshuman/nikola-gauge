import Gauge from './Gauge/Gauge';
import Tuple from './Common/Tuple';

const gauges: Gauge[] = [];
const range: Tuple<number>[] = [new Tuple<number>(0,400), new Tuple<number>(0,200)];
const target: Tuple<number>[] = [new Tuple<number>(100,150), new Tuple<number>(90,110)];
const center: number[] = [125, 100];

for(let i = 1; i <= 2; i++) {
    const canvas: any = document.getElementById('canvas' + i);
    const ctx: any = canvas.getContext('2d');
    const gauge = new Gauge(ctx, canvas.width, canvas.height);
    // shrink line graph range to emphasize target zone
    gauge.MaximumMagnutide = (gauge.Maximum - gauge.Minimum) / 4; 
    gauge.Minimum = range[i-1].v1;
    gauge.Maximum = range[i-1].v2;
    gauge.TargetMinimum = target[i-1].v1;
    gauge.TargetMaximum = target[i-1].v2;
    gauge.CenterValue = center[i-1];
    gauge.Value = 100;
    gauges.push(gauge);
}

window.setInterval(() => {
    gauges.forEach(gauge => {
        gauge.Value = gauge.Value + (Math.random() - 0.5) * 20;
    });
}, 1000);