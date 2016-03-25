import * as request from "request";
import {IFormatter} from "./formatter";
import {IScheduler} from "./scheduler";
import {Item} from "./models/item"

interface IMiner {
    run(lambda: (items: Array<Item>) => void): void;
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

    run(lambda: (items: Array<Item>) => void): void {
        var counter = 0;

        this.scheduler.run(() => {
            this.mine(counter, 100).then(items => {
                if (items.length !== 100) {
                    counter = 0;
                }
                lambda(items);
                counter++;
            }, function(err) {
                console.error(err); //connection or request error.
            });
        });
    }

    private mine(pageNumber: number, count: number): Promise<Array<Item>> {
        return new Promise<Array<Item>>((resolve, reject) => {
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

                this.formatter.format(html).then(items => {
                    var itemsString = JSON.stringify(items);
                    if (itemsString.includes("FAILED")) {
                        reject("Steam XML has some errors. Did not parse correctly.");
                    } else {
                        resolve(items);
                    }
                });
            });
        });
    }
}