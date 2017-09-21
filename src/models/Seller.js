import { BaseModel } from "../BaseModel";
import { ExperienceCollection } from "../collections/Experiences";

export const Seller = BaseModel.extend({
    urlRoot: "/sellers",

    initialize() {
        this.experiences = new ExperienceCollection();

        this.experiences.filters.seller = this.id;
    },

    getExperiences() {
        return this.experiences;
    }
});
