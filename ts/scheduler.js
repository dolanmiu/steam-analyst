"use strict";
var Scheduler = (function () {
    function Scheduler(interval) {
        this.interval = interval;
    }
    Scheduler.prototype.run = function () {
        setInterval(this.lambda(), this.interval);
    };
    return Scheduler;
}());
exports.Scheduler = Scheduler;
