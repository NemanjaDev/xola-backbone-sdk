import Backbone from 'backbone';
import _ from "underscore";
import { UrlHelper } from '../helpers/url_helper';
import { UserPreferences } from './UserPreferences';
import { PaymentMethodCollection } from './Payment/PaymentMethod';
import { FeeCollection } from './Fee';
import { PartnerFeeFormulaCollection } from './partner_fee_formula';

export const Seller = Backbone.Model.extend({
  url() {
    return UrlHelper.xola(`/api/sellers/${this.get('id')}`);
  },

  defaults() {
    return {
      locale: 'en',
      paymentMethods: new PaymentMethodCollection(),
      fees: new FeeCollection(),
      partnerFeeFormulas: new PartnerFeeFormulaCollection(),
      preferences: new UserPreferences(null, { parent: this })
    };
  },

  /**
   * Returns feature settings for this seller
   *
   * @param {string} feature Name of the feature
   * @param {string} [key]   Specific setting for the feature.
   * @param {*}      [defParam]   Default value to return if no feature setting was found
   */
  getFeatureSettings(feature, key, defParam) {
    let def = defParam;
    if (_.isUndefined(def)) def = null;
    const meta = this.get('meta');

    // If this seller has no settings for this feature, return null
    if (_.isUndefined(meta) || _.isUndefined(meta.features) ||
      _.isUndefined(meta.features[feature])) return def;

    // If no feature key is specified, return all of this feature's settings
    if (_.isUndefined(key)) return meta.features[feature];

    return _.isUndefined(meta.features[feature][key]) ? def : meta.features[feature][key];
  },
});
