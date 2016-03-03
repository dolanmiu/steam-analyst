"use strict";
var request = require("request");
var Miner = (function () {
    function Miner(formatter, scheduler) {
        this.formatter = formatter;
        this.scheduler = scheduler;
    }
    Miner.prototype.parseJsonBody = function (body) {
        var html;
        try {
            html = JSON.parse(body).results_html.replace(/(?:\\[rnt]|[\r\n\t]+)+/g, "");
        }
        catch (err) {
            return "";
        }
        return html;
    };
    Miner.prototype.run = function () {
        this.scheduler.lambda = this.mine(counter, 100).then(function (items) {
            if (items.length !== 100) {
                console.info('Scheduler found no more items, page count is now reset. Last page at: ' + counter);
                counter = 0;
            }
            items.forEach(function (element) {
                var newItem = new Item(element);
                updateItem(newItem);
            });
            counter += 1;
            console.info('Scheduler retrieved ' + items.length + ' items from steam community.');
        }, function (err) {
            console.error(err); //connection or request error.
        });
    };
    Miner.prototype.mine = function (pageNumber, count) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            var startItemNumber = pageNumber * count;
            var url = "http://steamcommunity.com/market/search/render/?query=&start=" + startItemNumber + "&count=" + count + "&appid=730";
            request(url, function (error, response, body) {
                if (error && response.statusCode !== 200) {
                    return reject(error);
                }
                var html = _this.parseJsonBody(body);
                if (html === "") {
                    return reject();
                }
                _this.formatter.format(html).done(function (items) {
                    var itemsString = JSON.stringify(items);
                    if (itemsString.includes("FAILED")) {
                        reject("Steam XML has some errors. Did not parse correctly.");
                    }
                    else {
                        resolve(items);
                    }
                });
            });
        });
        return promise;
    };
    return Miner;
}());
exports.Miner = Miner;
