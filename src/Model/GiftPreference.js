import Backbone from 'backbone';

export const GiftPreference = Backbone.Model.extend({
  defaults() {
    return {
      showAdditionalExperiences: true,
      customerPhoneRequired: false,
      captchaEnabled: false
    };
  }
});
