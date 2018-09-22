import { BaseModel } from "../BaseModel";
import { ParseHelper } from "../ParseHelper";
import { ExperienceCollection } from "../collections/Experiences";
import { OrderCollection } from "../collections/Orders";

export const Event = BaseModel.extend({
    urlRoot: "/events",

    /**
     * Return's true if the event is an all-day event
     *
     * @returns {boolean}
     */
    isAllDay() {
        var time = this.get('start').format('HHmm');
        return (time === '0000');
    },
}, {
    PARSERS: {
        start_date: ParseHelper.Date,
        experience: ParseHelper.Model(ExperienceCollection),
        orders: ParseHelper.Collection(OrderCollection)
    },
    OPEN_UNLIMITED: 99999
});