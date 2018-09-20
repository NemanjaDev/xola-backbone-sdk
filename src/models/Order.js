import { BaseCollection } from "../BaseCollection";
import { BaseModel } from "../BaseModel";
import { Fee } from "./Fee";
import { ParseHelper } from "../ParseHelper";
import { OrderDemographicCollection } from "../collections/OrderDemographics";
import { Payment } from "./Payment";

export const Order = BaseModel.extend({
    urlRoot: "/orders",

    calculateAmount() {
        var basePrice = this.get("experience").get("price");
        var currency = this.get("experience").get("currency");
        var baseAmount = 0;
        var totalQuantity = 0;

        // Sum up all the demographics
        this.get("demographics").each((orderDemographic) => {
            var quantity = orderDemographic.get("quantity");
            var price = orderDemographic.calculatePrice(basePrice);
            var amount = price * quantity;

            totalQuantity += quantity;
            baseAmount += amount;
        });
        if (this.get('experience').get('priceType') === Fee.SCOPE_OUTING) {
            baseAmount = basePrice;
        }

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
                            feeAmount = fee.get('amount');
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
                    caption: fee.get('name'),
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
    },

    getMaxQuantity() {
        var group = this.get('experience').get('group');
        if (group) {
            var max = group.outingMax || Event.OPEN_UNLIMITED;
            if (this.availability && this.availability.isAvailable()) {
                // Model has availability flag set. i.e. Availability for the specified arrival date and time
                var totalOpenCount = this.availability.getTotalOpenCount();
                if (totalOpenCount < max) {
                    max = totalOpenCount;
                }
                if (this.availability.hasTimeSlots() && this.has('arrivalTime')) {
                    var availabilitySlot = this.availability.get('slots')
                        .find({time: this.get('arrivalTime').toString()});
                    if (availabilitySlot && availabilitySlot.get('count') != Event.OPEN_UNLIMITED) {
                        max = availabilitySlot.get('count');
                    }
                }
            }

            return max;
        }
    }
}, {
    PARSERS: {
        demographics: ParseHelper.Collection(OrderDemographicCollection),
        payment: ParseHelper.Model(Payment)
    }
});