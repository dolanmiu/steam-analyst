export class Item {
    price: {
        steam: number,
        currency: string
    };
    quantity: number;
    details: {
        marketName: string,
        model: string,
        set: string,
        exterior: string
    };
    iconUrl: string;
}