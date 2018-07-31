import { BaseModel } from "../BaseModel";
import { Config } from "../Config";

export const Delegator = BaseModel.extend({
    urlRoot: "/delegators",

    getPictureUrl(size) {
        size = size || "small";
        return Config.baseUrl + this.url("/users") + "/picture?size=" + size;
    }
});