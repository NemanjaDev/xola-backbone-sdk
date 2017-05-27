import Backbone from "backbone";
import { Experience } from "./Model/Experience";
import { ExperienceCollection } from "./Collection/Experiences";

module.exports = {
    Model: {
        Experience: Experience
    },

    Collection: {
        Experiences: ExperienceCollection
    },

    setBaseUrl(baseUrl = "http://xola.com/api") {
        Backbone.$.ajaxSetup({
            beforeSend: function (jqXHR, settings) {
                settings.url = baseUrl + settings.url;
                settings.crossDomain = true;
            }
        });
    },

    setApiKey(apiKey) {
        var headers = Backbone.$.ajaxSetup().headers || {};

        if (apiKey) {
            headers["X-API-KEY"] = apiKey;
        }
        else {
            delete headers["X-API-KEY"];
        }

        Backbone.$.ajaxSetup($.ajaxSettings, {
            headers
        });
    }
}