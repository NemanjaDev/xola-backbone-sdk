import { BaseModel } from "../BaseModel";
import { BaseCollection } from "../BaseCollection";
import { Seller } from './Seller';
import { Experience } from './experience';
import { GiftOffer } from './GiftOffer';

export const ButtonItem = BaseModel.extend({

    defaults() {
        return {
            experience: new Experience(),
            giftOffer: new GiftOffer()
        };
    },
}, {
    TYPE_EXPERIENCE: 'experience',
    TYPE_GIFT_OFFER: 'gift_offer',
    TYPE_GIFT: 'gift',
});

export const ButtonItemCollection = BaseCollection.extend({
    model: ButtonItem,

    comparator(buttonItem) {
        return buttonItem.get('sequence');
    },
});

export const Button = BaseModel.extend({
    urlRoot: "/buttons",

    defaults() {
        return {
            type: Button.TYPE_GIFT,
            items: new ButtonItemCollection(),
            seller: new Seller(),
        };
    },
}, {
    TYPE_CHECKOUT: 'checkout',
    TYPE_GIFT: 'gift',
    TYPE_TIMELINE: 'timeline',
});
