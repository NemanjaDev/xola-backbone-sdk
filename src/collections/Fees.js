import { BaseCollection } from "../BaseCollection";
import { Fee } from "../models/Fee";

export const FeeCollection = BaseCollection.extend({
    model: Fee
}, {
    POOL_ID: 'Fees'
});
