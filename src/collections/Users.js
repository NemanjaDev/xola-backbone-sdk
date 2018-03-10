import { BaseCollection } from "../BaseCollection";
import { User } from "../models/User";

export const UserCollection = BaseCollection.extend({
    model() {
        User
    }
}, {
    POOL_ID: 'Users'
});