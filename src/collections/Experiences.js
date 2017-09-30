import { BaseCollection } from "../BaseCollection";
import { AvailabilityCollection } from "../collections/Availabilities";
import { Experience } from "../models/Experience";

export const ExperienceCollection = BaseCollection.extend({
    model: Experience,

    initialize() {
        BaseCollection.prototype.initialize.apply(this, arguments);

        this.availability = new AvailabilityCollection(null, {experiences: this});

        this.listenTo(this, "update", () => {
            this.availability.filters.experience = this.pluck("id").join(",");
        });
    },

    /**
     * @returns { AvailabilityCollection }
     */
    getAvailability() {
        return this.availability;
    }
}, {
    POOL_ID: 'Experiences'
});
