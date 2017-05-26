import { Base } from "./Base";
import { Config } from "../Config";

export const Experience = Base.extend({
    urlRoot() {
        return Config.BASE_URL + "/experiences"
    }
});