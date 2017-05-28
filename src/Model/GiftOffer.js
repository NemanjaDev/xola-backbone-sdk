import PageableCollection from 'backbone.paginator';
import {Discount} from "./discount";
import {Base} from "./discount";
import {Config} from "../Config";

export const GiftOffer = Base.extend({
    urlRoot: "/giftOffers",

    defaults() {
        return {
            currency: 'USD',
            name: '',
            desc: '',
            price: '',
            minimumPrice: 0,
            discount: new Discount(),
            type: GiftOffer.TYPE_FIXED,
            object: 'gift_offer'
        };
    },

    isFixedType() {
        return (this.get('type') === GiftOffer.TYPE_FIXED);
    },

    getObjectType() {
        return 'gift_offer';
    }
}, {
    TYPE_FIXED: 'fixed',
    TYPE_VARIABLE: 'variable'
});

export const GiftOfferCollection = PageableCollection.extend({
    model: GiftOffer,
    urlRoot: "/giftOffers",

    state: {
        pageSize: 100,
        firstPage: 0,
    },

    queryParams: {
        currentPage: 'skip',
        pageSize: 'limit',
    },

    parseRecords(resp) {
        return resp.data;
    },

    parseLinks(resp) {
        return resp.paging;
    },

    /**
     * Sort comparator that sorts by gift offer name.
     *
     * @param {GiftOffer} model
     */
    comparator(model) {
        return model.get('name');
    },
});
