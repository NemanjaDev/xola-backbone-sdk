import Backbone from 'backbone';
import {Base} from "./Base";
import _ from 'underscore';
import {Payment} from './Payment/Payment';

export const Adjustment = Base.extend({

    defaults() {
        return {
            payment: new Payment(),
        };
    },

    isPaidByCard() {
        const payment = this.get('payment');
        return payment && payment.isCreditCard();
    },

    isGiftPayment() {
        const payment = this.get('payment');
        return payment && payment.get('method') === Payment.METHOD_GIFT;
    },

    isFee() {
        return this.get('type') === Adjustment.TYPE_FEE;
    },
}, {
    TYPE_COUPON: 'coupon',
    TYPE_COUPON_USE: 'coupon_use',
    TYPE_DISCOUNT: 'discount',
    TYPE_DISCOUNT_GROUP: 'discount_group',
    TYPE_DISCOUNT_SOCIAL: 'discount_social',
    TYPE_DISCOUNT_GIFT_OFFER: 'discount_gift_offer',
    TYPE_AFFILIATE_DISCOUNT: 'discount_affiliate',
    TYPE_AFFILIATE_DEPOSIT: 'affiliate_deposit', // Amount that the traveler has already paid to the affiliate
    TYPE_MODIFY: 'modify',
    TYPE_INCREASE: 'increase',
    TYPE_DECREASE: 'decrease',
    TYPE_FEE: 'fee',
    TYPE_VOID: 'void',
    TYPE_PAYMENT: 'payment',
    TYPE_PAYMENT_DEPOSIT: 'payment_deposit',
    TYPE_PAYMENT_REQUEST: 'payment_request',
    TYPE_REFUND: 'refund',
    TYPE_REFUND_FEE: 'refund_fee',
    TYPE_DISCREPANCY: 'discrepancy',
    TYPE_COUPON_DELTA: 'coupon_delta',
    TYPE_GROUP_DISCOUNT_DELTA: 'group_discount_delta',
    TYPE_AFFILIATE_DISCOUNT_DELTA: 'discount_affiliate_delta',
    TYPE_ACCEPT: 'accept',
    TYPE_PRINT_TICKET: 'print_ticket',
    TYPE_DISPUTE_FUNDS_WITHDRAWN: 'dispute_funds_withdrawn',
    TYPE_DISPUTE_FUNDS_REINSTATED: 'dispute_funds_reinstated',
    TYPE_EMAIL_RECEIPT: 'email_receipt',
    TYPE_EMAIL_GIFT_RECIPIENT: 'email_gift_recipient',
    TYPE_EMAIL_GIFT_CUSTOMER: 'email_gift_customer',

});

export const AdjustmentCollection = Backbone.Collection.extend({
    model: Adjustment,
    relativeUri: '/adjustments',

    /**
     * The order that these adjustments belong to
     */
    parent: null,

    initialize(models, options) {
        const modelOptions = options || {};
        if (!_.isUndefined(modelOptions.parent)) {
            // All adjustments must have a parent since they are always embedded documents
            this.parent = modelOptions.parent;
        }
    },

    /**
     * Constructs the server API endpoint url for this collection.
     *
     * @returns {String} A url
     */
    url() {
        let url = this.relativeUri;
        if (this.parent) {
            // Prefix the parent's url to this collection's url
            url = this.parent.url() + url;
        }
        return url;
    },
});

