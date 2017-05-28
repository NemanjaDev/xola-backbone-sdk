import {Config} from "../Config";
import {Base} from "./base";
import {Experience} from "./experience";
import {Payment} from "./payment/payment";
import {AdjustmentCollection} from "./adjustment";

export const Order = Base.extend({
    urlRoot: "/orders",

    /**
     * Return a set of default values. This is required here because the value of payment attribute is an
     * instance of Payment prototype. If this is not a function the same instance will be passed to all the new Orders
     * making things complicated because if any of the attribute in the instance is changed, all other order models will
     * be affected. Making this a function will create a new instance of Payment for every new order model
     *
     * @return {Object}
     */
    defaults: function () {
        var customerLocale = window.navigator.language;
        customerLocale = customerLocale.replace('-', '_');
        return {
            quantity: 0,
            demographics: new OrderDemographics([], {parent: this}),
            groupSize: 1,
            balance: 0,
            baseAmount: 0,
            amount: 0,
            currency: 'USD',
            source: Order.SOURCE_XOLA,
            priceType: Experience.PRICE_TYPE_PERSON,
            guestType: Experience.GUEST_TYPE_NORMAL,
            payment: new Payment({method: Payment.METHOD_CREDIT_CARD}),
            adjustments: new AdjustmentCollection([], {parent: this}),
            guestStatus: Order.GUEST_STATUS_PENDING,
            affiliateCommission: 0,
            amountPaid: 0,
            type: 'order',
            customerLocale: customerLocale
        };
    }

});
