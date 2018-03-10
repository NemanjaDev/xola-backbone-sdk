import { BaseModel } from "../BaseModel";

export const Fee = BaseModel.extend({
    urlRoot: "/fees"
}, {
    AMOUNT_TYPE_PERCENT: 'percent',
    AMOUNT_TYPE_ABSOLUTE: 'absolute',

    SCOPE_PERSON: 'person',
    SCOPE_OUTING: 'outing'
});