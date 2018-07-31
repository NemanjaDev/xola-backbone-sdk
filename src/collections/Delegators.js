import { BaseCollection } from "../BaseCollection";
import { Delegator } from "../models/Delegator";

export const DelegatorCollection = BaseCollection.extend({
    model: Delegator,

    parse(resp) {
        if (resp.hasOwnProperty("sellers")) {
            return resp.sellers;
        }

        return resp;
    },
});