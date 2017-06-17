import { BaseModel } from "../BaseModel";
import { ParseHelper } from "../ParseHelper";
import { ExperienceCollection } from "../collections/Experiences";

export const Event = BaseModel.extend({
    urlRoot: "/events",
}, {
    PARSERS: {
        start_date: ParseHelper.Date,
        experience: ParseHelper.Model(ExperienceCollection)
    }
});