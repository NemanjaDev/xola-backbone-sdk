import Backbone from 'backbone';
import $ from "jquery";

export const Payment = Backbone.Model.extend({
    validate() {
        if (this.get('method') === Payment.METHOD_CREDIT_CARD) {
            return this.get('card').validate();
        }
        return true;
    },

    isCreditCard() {
        return this.get('method') && this.get('method') === Payment.prototype.METHOD_CREDIT_CARD;
    },

    isPayLater() {
        return this.get('method') && this.get('method') === Payment.prototype.METHOD_LATER;
    },
}, {
    METHOD_CASH: 'cash',
    METHOD_CHECK: 'check',
    METHOD_CREDIT_CARD: 'cc',
    METHOD_OTHER: 'other',
    METHOD_LATER: 'later',
    METHOD_AFFILIATE_DEPOSIT: 'affiliate_deposit',
    METHOD_VOUCHER: 'voucher',
    METHOD_GIFT: 'gift',

    prettyMethod(method) {
        let name;
        switch (method) {
            case Payment.METHOD_CREDIT_CARD:
                name = 'Credit Card';
                break;
            case Payment.METHOD_AFFILIATE_DEPOSIT:
                name = 'Affiliate Deposit';
                break;
            default:
                name = $(method).humanize().s;
                break;
        }
        return name;
    },

    prettyCustomMethod(id) {
        if (window.seller) {
            const paymentMethods = window.seller.get('paymentMethods');
            if (paymentMethods && paymentMethods.get(id)) {
                return paymentMethods.get(id).get('name');
            }
        }
        return false;
    },
});
