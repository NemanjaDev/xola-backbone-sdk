import { BaseModel } from "../BaseModel";

export const Order = BaseModel.extend({
    urlRoot: "/orders",

    calculateAmount() {
        var totalQuantity = 0;
        var totalAmount = 0;

        var basePrice = this.get("experience").get("price");
        var currency = this.get("experience").get("currency");

        // Sum up all the demographics
        this.get("demographics").each((orderDemographic) => {
            var quantity = orderDemographic.get("quantity");
            var price = orderDemographic.calculatePrice(basePrice);
            var amount = price * quantity;

            totalQuantity += quantity;
            totalAmount += amount;
        });

        // TODO: Sum up all fees

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

        json.demographics = this.get("demographics").toJSON();

        json.seller = {
            id: this.get("seller").id
        };

        json.experience = {
            id: this.get("experience").id
        };

        json.payment = this.get("payment").toJSON();

        return json;
    }
});