import { BaseCollection } from "../BaseCollection";
import { OrderDemographic } from "../models/OrderDemographic";

export const OrderDemographicCollection = BaseCollection.extend({
    model: OrderDemographic
}, {
    POOL_ID: 'OrderDemographics'
});
