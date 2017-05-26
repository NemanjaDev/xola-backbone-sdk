import Backbone from 'backbone';
import { GiftPreference } from './GiftPreference';
/**
 * This model represents the preferences hash stored within a user
 */
export const UserPreferences = Backbone.Model.extend({
  defaults() {
    return {
      gift: new GiftPreference(),
    };
  }
});
