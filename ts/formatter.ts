export interface IFormatter {
    format(html: string): Promise<string>;
}

export class Formatter implements IFormatter {

    format(html: string): Promise<string> {
        return null;
    }

    private getPrice(priceText: string): RegExpExecArray {
        var myRegexp = /Starting at:\$([0-9\.]+) ([A-Z]+)/g,
            match = myRegexp.exec(priceText);
        return match;
    }

    private getImageUrl(imageText: string): RegExpExecArray {
        var myRegexp = /http:\/\/steamcommunity-a.akamaihd.net\/economy\/image\/(.+)\//g,
            match = myRegexp.exec(imageText);
        return match;
    }

    private splitMarketName(marketName: string): RegExpExecArray {
        var myRegexp = /([^|]+) \| ([a-zA-Z \-]+) \(([a-zA-Z \-]+)\)/g,
            match = myRegexp.exec(marketName);
        return match;
    }
}