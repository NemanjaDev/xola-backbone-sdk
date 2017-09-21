import { BaseModel } from "../BaseModel";
import { Availability } from "./Availability";

export const Experience = BaseModel.extend({
    urlRoot: "/experiences",

    initialize() {
        BaseModel.prototype.initialize.apply(this, arguments);

        this.availability = new Availability(null, {
            parent: this
        });
    },

    getAvailability() {
        return this.availability;
    }
});