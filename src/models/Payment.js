import _ from "underscore";
import { Card } from "./Card";
import { BaseModel } from "../BaseModel";
import {ParseHelper} from "../ParseHelper";

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
    PARSERS: {
        card: ParseHelper.Model(Card)
    }
}, PaymentMethods));