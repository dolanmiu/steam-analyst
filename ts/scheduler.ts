export interface IScheduler {
    lambda: (pageNumber: number, count: number) => void;
    run();
}

export class Scheduler {

    private interval: number;

    public lambda: () => void;

    constructor(interval: number) {
        this.interval = interval
    }


    run() {
        setInterval(this.lambda(), this.interval);
    }
    
}