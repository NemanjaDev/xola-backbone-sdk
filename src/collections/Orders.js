import { BaseCollection } from "../BaseCollection";
import { Order } from "../models/Order";

export const OrderCollection = BaseCollection.extend({
    model: Order
}, {
    POOL_ID: 'Orders'
});
