import { BaseCollection } from "../BaseCollection";
import { Demographic } from "../models/Demographic";

export const DemographicCollection = BaseCollection.extend({
    model: Demographic
}, {
    POOL_ID: 'Demographics'
});
