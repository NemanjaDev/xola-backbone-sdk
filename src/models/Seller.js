import { BaseModel } from "../BaseModel";
import { ExperienceCollection } from "../collections/Experiences";
import { GuideCollection } from "../collections/Guides";

export const Seller = BaseModel.extend({
    urlRoot: "/sellers",

    initialize() {
        this.experiences = new ExperienceCollection();
        this.experiences.filters.seller = this.id;

        this.guides = new GuideCollection(null, {
            parent: this
        });
        this.guides.filters.seller = this.id;
    },

    getExperiences() {
        return this.experiences;
    },

    getGuides() {
        return this.guides;
    },

    isAdditionalBillingInfoRequired: function () {
        var paymentPreference = this.get('preferences').get('payment');
        return paymentPreference.get('requireAdditionalBillingInfo');
    },
});
