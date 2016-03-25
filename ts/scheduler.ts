export interface IScheduler {
    lambda: (pageNumber: number, count: number) => void;
    run(): void;
}

export class Scheduler implements IScheduler {

    private interval: number;

    public lambda: () => void;

    constructor(interval: number) {
        this.interval = interval
    }


    run(): void {
        setInterval(this.lambda(), this.interval);
    }

}