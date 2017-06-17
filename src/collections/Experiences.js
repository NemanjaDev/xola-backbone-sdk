import { BaseCollection } from "../BaseCollection";
import { Experience } from "../models/Experience";

export const ExperienceCollection = BaseCollection.extend({
    model: Experience
}, {
    POOL_ID: 'Experiences'
});
