import Backbone from 'backbone';
import { Seller } from './Seller';
import { Experience } from './experience';
import { GiftOffer } from './gift_offer';
import { UrlHelper } from '../helpers/url_helper';

export const ButtonItem = Backbone.Model.extend({

  defaults() {
    return {
      experience: new Experience(),
      giftOffer: new GiftOffer()
    };
  },
}, {
  TYPE_EXPERIENCE: 'experience',
  TYPE_GIFT_OFFER: 'gift_offer',
  TYPE_GIFT: 'gift',
});

export const ButtonItemCollection = Backbone.Collection.extend({
  model: ButtonItem,

  comparator(buttonItem) {
    return buttonItem.get('sequence');
  },
});

export const Button = Backbone.Model.extend({
  urlRoot: UrlHelper.xola('/api/buttons'),

  defaults() {
    return {
      type: Button.TYPE_GIFT,
      items: new ButtonItemCollection(),
      seller: new Seller(),
    };
  },
}, {
  TYPE_CHECKOUT: 'checkout',
  TYPE_GIFT: 'gift',
  TYPE_TIMELINE: 'timeline',
});
