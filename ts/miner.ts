import * as request from "request";
import {IFormatter} from "./formatter";
import {IScheduler} from "./scheduler";

interface IMiner {
    mine(pageNumber: number, count: number): Promise<string[]>;
}

export class Miner implements IMiner {

    private formatter: IFormatter;
    private scheduler: IScheduler;

    constructor(formatter: IFormatter, scheduler: IScheduler) {
        this.formatter = formatter;
        this.scheduler = scheduler;
    }

    private parseJsonBody(body: string): string {
        var html;
        try {
            html = JSON.parse(body).results_html.replace(/(?:\\[rnt]|[\r\n\t]+)+/g, "");
        } catch (err) {
            return "";
        }
        return html;
    }

    run(): void {
        this.scheduler.lambda = this.mine(counter, 100).then(items => {
            if (items.length !== 100) {
                console.info('Scheduler found no more items, page count is now reset. Last page at: ' + counter);
                counter = 0;
            }
            items.forEach(element => {
                var newItem = new Item(element);
                updateItem(newItem);
            });
            counter += 1;
            console.info('Scheduler retrieved ' + items.length + ' items from steam community.');
        }, function(err) {
            console.error(err); //connection or request error.
        });
    }

    mine(pageNumber: number, count: number): Promise<string[]> {
        var promise = new Promise<string[]>((resolve, reject) => {
            var startItemNumber = pageNumber * count;
            var url = "http://steamcommunity.com/market/search/render/?query=&start=" + startItemNumber + "&count=" + count + "&appid=730";

            request(url, (error, response, body) => {
                if (error && response.statusCode !== 200) {
                    return reject(error);
                }

                var html = this.parseJsonBody(body);
                if (html === "") {
                    return reject();
                }

                this.formatter.format(html).done((items) => {
                    var itemsString = JSON.stringify(items);
                    if (itemsString.includes("FAILED")) {
                        reject("Steam XML has some errors. Did not parse correctly.");
                    } else {
                        resolve(items);
                    }
                });
            });
        });
        return promise;
    }
}