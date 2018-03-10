import { BaseModel } from "../BaseModel";
import { Availability } from "./Availability";
import { DemographicCollection } from "../collections/Demographics";
import { FeeCollection } from "../collections/Fees";
import { ParseHelper } from "../ParseHelper";

export const Experience = BaseModel.extend({
    urlRoot: "/experiences",

    initialize() {
        BaseModel.prototype.initialize.apply(this, arguments);

        this.availability = new Availability(null, {
            parent: this
        });

        this.fees = new FeeCollection(null, {
            parent: this
        });

        this.fees.filters.seller = this.get("seller").id;
    },

    getAvailability() {
        return this.availability;
    },

    getFees() {
        return this.fees;
    }
}, {
    PARSERS: {
        demographics: ParseHelper.Collection(DemographicCollection)
    }
});