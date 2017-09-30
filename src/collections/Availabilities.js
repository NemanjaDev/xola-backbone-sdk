import _ from "underscore";
import { BaseCollection } from "../BaseCollection";
import { Availability } from "../models/Availability";

export const AvailabilityCollection = BaseCollection.extend({
    model: Availability,

    initialize(models, options) {
        BaseCollection.prototype.initialize.apply(this, arguments);

        this.experiences = options.experiences;

        this.listenTo(this, "update", () => {
            this.each((availability) => {
                availability.parent.getAvailability().set(availability.attributes);
            });
        });
    },

    parse(resp) {
        var array = [];
        _.each(resp, (value, key, obj) => {
            value._experience = this.experiences.get(key);
            array.push(value);
        });

        return array;
    }
});