import { BaseCollection } from "../BaseCollection";
import { Event } from "../models/Event";

export const EventCollection = BaseCollection.extend({
    model: Event
});
