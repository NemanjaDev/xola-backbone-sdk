import {Base} from "./Base";
/**
 * This model describes a discount that can be associated with a demographic.
 */
export const Discount = Base.extend({
    defaults() {
        return {
            amount: 0,
            amountType: this.AMOUNT_TYPE_ABSOLUTE
        };
    },

    getDiscountedPrice(price) {
        return price - this.getDiscount(price);
    },

    getDiscount(price) {
        let discount;
        switch (this.get('amountType')) {
            case Discount.AMOUNT_TYPE_ABSOLUTE: {
                discount = (this.get('amount') <= price) ? this.get('amount') : 0;
                break;
            }
            case Discount.AMOUNT_TYPE_PERCENT: {
                discount = Math.round((price * this.get('amount')) / 100, 2);
                break;
            }
            default: {
                discount = 0;
                break;
            }
        }
        return discount;
    }
}, {
    AMOUNT_TYPE_PERCENT: 'percent',
    AMOUNT_TYPE_ABSOLUTE: 'absolute'
});
