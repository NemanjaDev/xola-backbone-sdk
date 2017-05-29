import Backbone from "backbone";

import { BaseModel } from "./BaseModel";
import { BaseCollection } from "./BaseCollection";

import { Experience } from "./models/Experience";
import { Event } from "./models/Event";
import { Seller } from "./models/Seller";
import { User } from "./models/User";

import { ExperienceCollection } from "./collections/Experiences";
import { EventCollection } from "./collections/Events";

const XolaBackboneSDK = {
    BaseModel: BaseModel,
    BaseCollection: BaseCollection,

    Model: {
        Experience: Experience,
        Event: Event,
        Seller: Seller,
        User: User
    },

    Collection: {
        Experiences: ExperienceCollection,
        Events: EventCollection
    },

    setBaseUrl(baseUrl) {
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

        Backbone.$.ajaxSetup(Backbone.$.ajaxSettings, {
            headers
        });
    }
};

XolaBackboneSDK.setBaseUrl("http://xola.com/api");

module.exports = XolaBackboneSDK;