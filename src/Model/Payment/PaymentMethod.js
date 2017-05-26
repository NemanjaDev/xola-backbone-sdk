import Backbone from 'backbone';
import _ from 'underscore';
import $ from "jquery";

import { Payment } from './Payment';
import { PaymentComment } from './PaymentComment';

export const PaymentMethod = Payment.extend({
  relativeUri: '/paymentMethods',
  parent: null,

  defaults() {
    return {
      comment: new PaymentComment(),
    };
  },

  initialize(attributes, options) {
    if (this.collection && this.collection.parent) {
      this.parent = this.collection.parent;
    }
    if (options && options.parent) {
      this.parent = options.parent;
    }
  },

  urlRoot() {
    let url = this.relativeUri;
    if (this.parent) {
      // Using /api/users here instead of this.parent.url() because seller has a /api/sellers url
      url = `/api/users/${this.parent.id}${this.relativeUri}`;
    }
    return url;
  },

  toJSON(...args) {
    const data = Backbone.Model.prototype.toJSON.apply(this, args);
    if (data.comment instanceof Backbone.Model) {
      data.comment = data.comment.toJSON();
    }
    return data;
  },

  validate(attrs) {
    const errors = {};
    _.each(attrs, (val, field) => {
      const strVal = $.trim(val);
      let commentModel;
      switch (field) {
        case 'name':
          if (!strVal || strVal === '') {
            errors[field] = 'Required';
          } else if (strVal.length > PaymentMethod.MAX_NAME_LENGTH) {
            errors[field] = `Maximum ${PaymentMethod.MAX_NAME_LENGTH} characters only`;
          }
          break;
        case 'comment':
          commentModel = this.get('comment');
          if (commentModel) {
            const commentErrors = this.get('comment').validate(val);
            if (commentErrors) {
              errors.comment = commentErrors;
            }
          }
          break;
        default:
          break;
      }
    }, this);
    if (!_.isEmpty(errors)) {
      return errors;
    }
    return null;
  },

  isActive() {
    const deletedAt = this.get('deletedAt');
    return _.isUndefined(deletedAt) || _.isNull(deletedAt);
  },
});

export const PaymentMethodCollection = Backbone.Collection.extend({
  model: PaymentMethod,
  parent: null,

  initialize(models, optionsParam) {
    const options = optionsParam || {};
    if (!_.isUndefined(options.parent)) {
      this.parent = options.parent;
    }
  },

  getActivePaymentMethods() {
    const filtered = this.filter(paymentMethod => paymentMethod.isActive());
    return new PaymentMethodCollection(filtered, { parent: this.parent });
  },
}, {
  MAX_NAME_LENGTH: 30,
});
