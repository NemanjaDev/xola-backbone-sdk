import Backbone from 'backbone';
import _ from 'underscore';
import { CurrencyHelper } from '../helpers/currency_helper';
import { UrlHelper } from '../helpers/url_helper';
import { AdjustmentCollection, Adjustment } from './Adjustment';
import { GiftOffer } from './gift_offer';
import { FeeCollection } from './Fee';
import { Product } from './Product';

export const Gift = Backbone.Model.extend({
  urlRoot: UrlHelper.xola('/api/gifts'),

  initialize(data, options) {
    this.options = options || {};
  },
  defaults() {
    return {
      type: 'gift', // To distinguish between Gift & Order objects
      quantity: 1,
      baseAmount: 0,
      amount: 0,
      currency: 'USD',
      product: new Product(),
      adjustments: new AdjustmentCollection([], { parent: this })
    };
  },

  validation() {
    let amountPattern = /^\d+(?:\.\d+){0,1}$/;
    let amountValidationMessage = 'Must be a number';
    if (CurrencyHelper.isZeroDecimal(this.get('currency'))) {
      amountPattern = /^\d+$/;
      amountValidationMessage = 'Must be a whole number';
    }
    const phoneRequired = this.get('seller').get('preferences').get('gift').customerPhoneRequired;
    return {
      amount: [
        { pattern: amountPattern, msg: amountValidationMessage },
        { min: 1, msg: 'Must be greater than 0' },
        { required: true },
      ],
      baseAmount: [
        { pattern: amountPattern, msg: amountValidationMessage },
        { min: 1, msg: 'Must be greater than 0' },
        { required: true },
      ],
      recipientName: {
        required: true,
      },
      recipientEmail: {
        required(val, attr, computed) {
          // Required only if certificate is being sent to the recipient
          return computed.sendToRecipient;
        },
        pattern: 'email',
      },
      customerName: {
        required: true,
      },
      customerEmail: {
        required: true,
        pattern: 'email',
      },
      customerPhone: {
        required: phoneRequired,
        msg: 'Customer phone number is required',
      },
      sendToRecipient: {
        required(val, attr, computed) {
          return !computed.sendToCustomer;
        },
        msg: 'Pick at least one recipient',
      },
      sendToCustomer: {
        required(val, attr, computed) {
          return !computed.sendToRecipient;
        },
        msg: 'Pick at least one recipient',
      },
    };
  },
}, {
  TYPE: 'gift',
  IMAGE: '/images/v2/icons/gift.png',
});
