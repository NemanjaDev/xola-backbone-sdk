import { BaseModel } from "../BaseModel";

export const Demographic = BaseModel.extend({
    urlRoot: "/demographics",

    getLabel() {
        return this.get("label");
    }
});