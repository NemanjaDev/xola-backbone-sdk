import _ from "underscore";
import { BaseModel } from "../BaseModel";

const ScheduleDepartureTimes = {
    DEPARTURE_FIXED: 'fixed',
    DEPARTURE_VARIES: 'varies',
};

const ScheduleRepeatCycles = {
    REPEAT_WEEKLY: 'weekly',
    REPEAT_CUSTOM: 'custom',
};

const ScheduleTypes = {
    TYPE_AVAILABLE: 'available',
    TYPE_UNAVAILABLE: 'unavailable'
};

export const Schedule = BaseModel.extend({
    urlRoot: null,

    /**
     * Checks if a given date falls in this schedule.
     *
     * @param {Date}   date
     * @param {Number} [time=null]
     * @return {boolean} TRUE if the date falls in this schedule
     */
    isValidDate: function(date, time) {
        if (!date) return false;
        if (_.isUndefined(time) || time === 0) {
            time = null;
        }

        var dateStr = date.format('Y-m-d'),
            found = false;

        switch (this.get('repeat')) {
            case ScheduleRepeatCycles.REPEAT_WEEKLY:
                // Weekly recurring schedule
                if (this.has('start')) {
                    if (dateStr < this.get('start')) {
                        // This schedule's start date has not arrived
                        return false;
                    }
                }

                if (this.has('end')) {
                    // This schedule has an end date
                    if (dateStr > this.get('end')) {
                        // This schedule's end date has passed
                        return false;
                    }
                }

                var day = date.getDay();
                if (_.indexOf(this.get('days'), day) > -1) {
                    // Valid day
                    found = true;
                }
                break;

            case ScheduleRepeatCycles.REPEAT_CUSTOM:
                // Custom dates
                if (_.indexOf(this.get('dates'), dateStr) > -1) {
                    // Valid date
                    found = true;
                }
                break;
        }

        if (found && time !== null) {
            // A time has also been specified, so try to match that as well
            found = _.contains(this.has('times') ? this.get('times') : [], time);
        }

        return found;
    }
}, _.extend(
    ScheduleDepartureTimes,
    ScheduleRepeatCycles,
    ScheduleTypes
));