import { BaseCollection } from "../BaseCollection";
import { Guide } from "../models/Guide";

export const GuideCollection = BaseCollection.extend({
    model: Guide,

    findByUser(user) {
        return this.find((guide) => {
            return guide.get("user").id == user.id;
        });
    }
}, {
    POOL_ID: 'Guides'
});
