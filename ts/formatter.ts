import * as htmlToJson from "html-to-json";
import {Item} from "./models/item";

export interface IFormatter {
    format(html: string): Promise<Array<Item>>;
}

export class Formatter implements IFormatter {

    format(html: string): Promise<Array<Item>> {
        return htmlToJson.parse(html, ['.market_listing_row_link', {
            'price': {
                'steam': $product => {
                    var price = this.getPrice($product.find('.market_listing_their_price').text());
                    if (price === null) {
                        return 'FAILED';
                    }
                    return price[1];
                },
                'currency': $product => {
                    var price = this.getPrice($product.find('.market_listing_their_price').text());
                    if (price === null) {
                        return 'FAILED';
                    }
                    return price[2];
                }
            },
            'quantity': $product => {
                return $product.find('.market_listing_num_listings_qty').text().replace(/\,/g, '');
            },
            'details': {
                'marketName': $product => {
                    return $product.find('.market_listing_item_name').text();
                },
                'model': $product => {
                    var splitName = this.splitMarketName($product.find('.market_listing_item_name').text());
                    if (splitName !== null) {
                        return splitName[1];
                    } else {
                        return '';
                    }
                },
                'set': $product => {
                    var splitName = this.splitMarketName($product.find('.market_listing_item_name').text());
                    if (splitName !== null) {
                        return splitName[2];
                    } else {
                        return '';
                    }
                },
                'exterior': $product => {
                    var splitName = this.splitMarketName($product.find('.market_listing_item_name').text());
                    if (splitName !== null) {
                        return splitName[3];
                    } else {
                        return '';
                    }
                }
            },
            'iconUrl': $product => {
                var imageUrl = this.getImageUrl($product.find('img').attr('src'));
                return imageUrl[1];
            }
        }]);
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