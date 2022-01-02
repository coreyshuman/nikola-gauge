
export type TimerEventHandler = () => void;
const INVALID_HANDLE: number = -1;
export class Timer {
    private interval: number;
    private enabled: boolean;
    private handle: number;
    private eventHandler: TimerEventHandler;

    constructor(interval: number, eventHandler?: TimerEventHandler, enabled?: boolean) {
        this.interval = interval;
        

        this.handle = INVALID_HANDLE;
        this.eventHandler = eventHandler ?? null;
        this.Enabled = eventHandler && enabled;
        console.log('timer ' + interval + ' ' + this.enabled);
    }

    get Interval(): number {
        return this.interval;
    }

    set Interval(interval: number) {
        this.interval = interval;
    }

    get Enabled(): boolean {
        return this.enabled;
    }

    set Enabled(enabled: boolean) {
        this.enabled = enabled;
        enabled ? this.startTimer() : this.endTimer();
    }

    set EventHandler(eventHandler: TimerEventHandler) {
        this.eventHandler = eventHandler;
    }

    private startTimer() : void {
        if(this.handle > 0) {
            this.endTimer();
        }
        if(this.eventHandler !== null) {
            this.handle = window.setInterval(this.eventHandler, this.interval);
        }
    }

    private endTimer() : void {
        if(this.handle > 0) {
            window.clearInterval(this.handle);
            this.handle = INVALID_HANDLE;
        }
    }

    public static getTicks(): number {
        return Date.now();
    }

    public static getTicksDiff(ticks: number): number {
        return Date.now() - ticks;
    }
}

export default Timer;