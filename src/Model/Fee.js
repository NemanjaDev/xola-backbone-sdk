import Backbone from 'backbone';
import _ from 'underscore';
import { CurrencyHelper } from '../helpers/currency_helper';
import { Currency } from '../helpers/currency';

export const Fee = Backbone.Model.extend({
  defaults() {
    return {
      all: true,
      experiences: [],
    };
  },

  /**
   * Returns a string representation of this fee that can be used as a caption in an adjustment.
   *
   * @param {Order} order
   * @returns {string}
   */
  getCaption(order) {
    let caption;

    switch (this.get('amountType')) {

      case Fee.AMOUNT_TYPE_PERCENT:
        // Percentage fee
        caption = `${this.get('amount')}%`;
        break;

      case Fee.AMOUNT_TYPE_ABSOLUTE:
        switch (this.get('scope')) {

          case Fee.SCOPE_OUTING:
            // Absolute fee per outing
            caption = Currency.format(this.get('amount'), order.get('currency'));
            break;

          case Fee.SCOPE_PERSON:
            // Absolute fee per person
            caption = `${Currency.translate(order.get('currency'))
              + this.calculateFee(order, true)} × ${
               order.get('quantity')}`;
            break;

          default:
            break;
        }
        break;

      default:
        break;

    }

    // Include the fee name
    caption = this.get('name') + (caption ? ` (${caption})` : '');

    return caption;
  },

  /**
   * Returns the applicable fee for an order.
   *
   * @param {Order}   order
   * @param {boolean} [personParam=false] If TRUE, the per person fee is returned
   *
   * @returns {number}
   */
  calculateFee(order, personParam) {
    let amount = 0;
    let person = personParam;

    if (_.isUndefined(person)) {
      person = false;
    }
    let base = 0;
    switch (this.get('amountType')) {

      case Fee.AMOUNT_TYPE_PERCENT:

        // Check if we are processing an order or gift
        if (order.has('type') && order.get('type') === 'gift') {
          base = order.get('baseAmount');
        }

        // Apply the fee on the base amount
        amount = (base * this.get('amount')) / 100;
        break;

      case Fee.AMOUNT_TYPE_ABSOLUTE:

        switch (this.get('scope')) {

          case Fee.SCOPE_OUTING:
            // Amount is a flat fee per order
            amount = this.get('amount');
            break;

          case Fee.SCOPE_PERSON:
            // Amount is a flat fee per person
            amount = this.get('amount') * (person ? 1 : order.get('quantity'));

            if (this.has('scopeModifier')
              && this.get('scopeModifier') === Fee.SCOPE_MODIFIER_PER_DAY) {
              const experience = app.findModel(order.get('experience').id, 'experiences');
              amount *= Math.ceil(experience.get('duration') / 60 / 24);
            }
            break;

          default:
            break;
        }
        break;
      default:
        break;
    }

    // Round to 2 decimals
    return CurrencyHelper.round(amount);
  },
}, {
  AMOUNT_TYPE_PERCENT: 'percent',
  AMOUNT_TYPE_ABSOLUTE: 'absolute',

  SCOPE_PERSON: 'person',
  SCOPE_OUTING: 'outing',

  SCOPE_MODIFIER_PER_DAY: 'day',
  SCOPE_MODIFIER_EXCLUDE_ADDON: 'excludeAddon',
});

export const FeeCollection = Backbone.Collection.extend({
  model: Fee,
  relativeUri: '/fees',

  /**
   * The model that these fees collection belong to
   */
  parent: null,

  initialize(models, optionsParam) {
    const options = optionsParam || {};

    if (!_.isUndefined(options.parent)) {
      // All fee collections must have a parent since they are always
      // embedded documents
      this.parent = options.parent;
    }

    this.listenTo(this, 'request', this.fetchStarted);
    this.listenTo(this, 'sync', this.fetchFinished);
    this.listenTo(this, 'error', this.fetchFinished);
  },

  fetchStarted() {
    this.fetching = true;
  },

  fetchFinished() {
    this.fetching = false;
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
