export interface IScheduler {
    run(lambda: () => void): void;
}

export class Scheduler implements IScheduler {

    private interval: number;

    constructor(interval: number) {
        this.interval = interval
    }


    run(lambda: () => void): void {
        setInterval(lambda(), this.interval);
    }

}