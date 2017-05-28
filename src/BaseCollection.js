import Backbone from "backbone";
import { BaseModel } from "./BaseModel"

export const BaseCollection = Backbone.Collection.extend({
    model: BaseModel,

    url() {
        return this.model.prototype.urlRoot
    },

    /**
     * Override so we can parse out paging information.
     *
     * @param {Object} resp
     *
     * @returns {Object} Response model data (without paging information)
     */
    parse: function(resp) {
        if (resp.hasOwnProperty("paging") && resp.hasOwnProperty("data")) {
            return resp.data;
        }

        return resp;
    }
});