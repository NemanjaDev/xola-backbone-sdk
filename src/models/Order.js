import { BaseCollection } from "../BaseCollection";
import { BaseModel } from "../BaseModel";
import { Fee } from "./Fee";
import { ParseHelper } from "../ParseHelper";
import { OrderDemographicCollection } from "../collections/OrderDemographics";

export const Order = BaseModel.extend({
    urlRoot: "/orders",

    calculateAmount() {
        var basePrice = this.get("experience").get("price");
        var currency = this.get("experience").get("currency");
        var baseAmount = basePrice;
        var totalQuantity = 0;

        // Sum up all the demographics
        this.get("demographics").each((orderDemographic) => {
            var quantity = orderDemographic.get("quantity");
            var price = orderDemographic.calculatePrice(basePrice);
            var amount = price * quantity;

            totalQuantity += quantity;
            baseAmount += amount;
        });

        var totalAmount = baseAmount;

        var totalFeeAmount = 0;
        var adjustments = new BaseCollection();
        this.get("experience").getFees().each((fee) => {
            var feeAmount = 0;
            switch (fee.get("scope")) {
                case Fee.SCOPE_PERSON:
                    feeAmount = fee.get('amount') * totalQuantity;
                    break;

                case Fee.SCOPE_OUTING:
                    switch (fee.get("amountType")) {
                        case Fee.AMOUNT_TYPE_ABSOLUTE:
                            feeAmount = this.get('amount');
                            break;

                        case Fee.AMOUNT_TYPE_PERCENT:
                            feeAmount = baseAmount * fee.get('amount') / 100;
                            break;
                    }
                    break;

                default:
                    // Unsupported fee
            }

            adjustments.add(
                new BaseModel({
                    type: "fee",
                    amount: feeAmount,
                    caption: "Fee",
                    code: fee.id,
                    meta: {fee: fee}
                })
            );

            totalFeeAmount += feeAmount;
        });

        totalAmount += totalFeeAmount;

        this.set("adjustments", adjustments);
        this.set("quantity", totalQuantity);
        this.set("amount", totalAmount);
    },

    checkIn(options) {
        var adjustment = new BaseModel({
            updates: {
                guestStatus: "arrived"
            }
        }, {
            parent: this
        });
        adjustment.urlRoot = "/modify";

        adjustment.save(null, options);
    },

    toJSON() {
        var json = BaseModel.prototype.toJSON.apply(this, arguments);

        if (this.get("demographics")) {
            json.demographics = this.get("demographics").toJSON();
        }

        if (this.get("seller")) {
            json.seller = {
                id: this.get("seller").id
            };
        }

        if (this.get("experience")) {
            json.experience = {
                id: this.get("experience").id
            };
        }

        if (this.get("payment")) {
            json.payment = this.get("payment").toJSON();
        }

        return json;
    }
}, {
    PARSERS: {
        demographics: ParseHelper.Collection(OrderDemographicCollection)
    }
});