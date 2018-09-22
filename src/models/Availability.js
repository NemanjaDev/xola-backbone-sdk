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
    },

    isAvailable: function () {
        return (!this.isBlackedOut() && this.getTotalOpenCount() > 0);
    },

    isBlackedOut: function () {
        let isBlackedOut = false;
        if (this.hasTimeSlots()) {
            let slots = this.get('slots');
            if (slots.length === 1) {
                let slot = slots.at(0);
                if (slot.get('count') === 0 && slot.get('time') === 0) {
                    isBlackedOut = true;
                }
            }
        }
        return isBlackedOut;
    },

    hasTimeSlots: function () {
        if (this.has('slots') && this.get('slots').size()) {
            let slots = this.get('slots');
            return !(slots.size() === 1 && slots.at(0).get('time') === 0);
        }
        return false;
    },

    getTotalOpenCount: function () {
        let total = 0;
        this.get('slots').each(function (slot) {
            total += slot.get('count');
        });
        return total;
    },
});