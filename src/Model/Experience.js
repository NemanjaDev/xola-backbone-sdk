import { BaseModel } from "./Base";
import { Config } from "../Config";

export const Experience = BaseModel.extend({
    urlRoot() {
        return Config.BASE_URL + "/experiences"
    }
});