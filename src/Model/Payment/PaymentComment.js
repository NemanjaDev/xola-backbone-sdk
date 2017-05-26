import Backbone from 'backbone';
import $ from "jquery";
import _ from 'underscore';

export const PaymentComment = Backbone.Model.extend({
  defaults() {
    return {
      enabled: true,
      title: 'Comment',
      required: false,
    };
  },

  initialize(attributes, options) {
    if (options && options.parent) {
      this.parent = options.parent;
    }
  },

  validate(attrs) {
    const errors = {};
    _.each(attrs, (v, field) => {
      const val = $.trim(v);
      switch (field) {
        case 'title':
          if (!val || val === '') {
            errors[field] = 'Required';
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
});
