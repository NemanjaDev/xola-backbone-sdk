import { BaseModel } from "../BaseModel";

export const Availability = BaseModel.extend({
    urlRoot: "/availability",

    initialize() {
        BaseModel.prototype.initialize.apply(this, arguments);
    },

    parse(attributes, options) {
        options.parent = attributes._experience;
        delete attributes._experience;

        return BaseModel.prototype.parse.call(this, attributes, options);
    },

    getSlotsByDate(date) {
        return this.get(date);
    },

    getSlotsByDateTime(date, time) {
        return this.getSlotsByDate(date)[time];
    }
});