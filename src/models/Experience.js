import Backbone from "backbone";
import { BaseModel } from "../BaseModel";
import { Availability } from "./Availability";
import { DemographicCollection } from "../collections/Demographics";
import { ParseHelper } from "../ParseHelper";

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
    },

    getDemographics() {
        return this.get("demographics");
    }
}, {
    PARSERS: {
        demographics: ParseHelper.Collection(DemographicCollection)
    }
});