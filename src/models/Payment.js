import _ from "underscore";
import { BaseModel } from "../BaseModel";

const PaymentMethods = {
    METHOD_CREDIT_CARD: "cc"
};

export const Payment = BaseModel.extend({
    toJSON() {
        var json = BaseModel.prototype.toJSON.apply(this, arguments);

        switch (this.get("method")) {
            case PaymentMethods.METHOD_CREDIT_CARD:
                json.card = this.get("card").toJSON();
                break;
        }

        return json;
    }
}, _.extend({
    PARSERS: {}
}, PaymentMethods));