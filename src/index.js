import $ from "jquery";
import Backbone from "backbone";
import { Config } from "./Config";

import { Experience } from "./Model/Experience";

module.exports = {
    Model: {
        Experience: Experience
    },

    Collection: {

    },

    setBaseUrl(url) {
        Config.BASE_URL = url;
    },

    setApiKey(apiKey) {
        var headers = Backbone.$.ajaxSetup().headers || {};

        if (apiKey) {
            headers["X-API-KEY"] = apiKey;
        }
        else {
            delete headers["X-API-KEY"];
        }

        $.ajaxSetup($.ajaxSettings, {
            headers
        });
    }
}