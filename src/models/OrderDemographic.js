import { BaseModel } from "../BaseModel";
import { ParseHelper } from "../ParseHelper";
import { DemographicCollection } from "../collections/Demographics";

export const OrderDemographic = BaseModel.extend({
    urlRoot: null,

    initialize(attributes) {
        BaseModel.prototype.initialize.apply(this, arguments);

        this.set({
            id: attributes.demographic.id,
            label: attributes.demographic.getLabel(),
        })
    },

    getQuantity() {
        return this.get("quantity");
    },

    setQuantity(quantity) {
        return this.set("quantity", quantity);
    },

    calculatePrice(basePrice) {
        var demographic = this.get("demographic");
        if (demographic.has("discount")) {
            switch (demographic.get("discount").amountType) {
                case "absolute":
                    return basePrice - demographic.get("discount").amount;
                    break;

                default:
                    // Unsupported discount type
                    return basePrice;
            }
        }
        else {
            return basePrice;
        }
    }
}, {
    PARSERS: {
        demographic: ParseHelper.Model(DemographicCollection),
    }
});