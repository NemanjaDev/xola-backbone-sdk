import Backbone from 'backbone';
import $ from 'jquery';

export const Card = Backbone.Model.extend({
    defaults() {
        return {
            number: '',
            cvv: '',
            expiryMonth: '',
            expiryYear: '',
            billingState: '',
            billingPostcode: '',
            billingName: '',
            billingCity: '',
            billingAddress: '',
        };
    },

    validation() {
        return {
            billingName: {
                required: true,
            },
            number: {
                required: true,
                creditCard: true,
            },
            cvv: {
                required: !(this.has('swipe') && this.get('swipe')),
                cvv: true,
                pattern: 'number',
                length: this.cardType() === 'American Express' ? 4 : 3,
            },
            expiryMonth: {
                required: true,
                pattern: 'number',
            },
            expiryYear: {
                required: true,
                pattern: 'number',
            },
            billingPostcode: {
                required: true,
            },
        };
    },

    cardType() {
        let cardNumber = this.get('number');
        const p = {};
        p['51'] = 'Mastercard';
        p['52'] = 'Mastercard';
        p['53'] = 'Mastercard';
        p['54'] = 'Mastercard';
        p['55'] = 'Mastercard';
        p['34'] = 'American Express';
        p['37'] = 'American Express';
        p['4'] = 'VISA';
        p['6'] = 'Discover Card';
        p['35'] = 'JCB';
        p['30'] = 'Diners Club';
        p['36'] = 'Diners Club';
        p['38'] = 'Diners Club';

        if (cardNumber) {
            cardNumber = $.trim(cardNumber.toString());
            /* eslint-disable */
            for (const k in p) {
                if (cardNumber.indexOf(k) === 0) {
                    return p[k];
                }
            }
            /* eslint-enable */
        }
        return null;
    },
});
