import _ from "underscore";
import Backbone from "backbone";

import { BaseModel } from "./BaseModel";
import { BaseCollection } from "./BaseCollection";

import { Experience } from "./models/Experience";
import { Event } from "./models/Event";
import { Seller } from "./models/Seller";
import { User } from "./models/User";

import { ExperienceCollection } from "./collections/Experiences";
import { EventCollection } from "./collections/Events";
import { UserCollection } from "./collections/Users";

import { CollectionPool } from "./CollectionPool";

var currentUser = null;

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
        Events: EventCollection,
        Users: UserCollection
    },

    CollectionPool: CollectionPool,

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
    },

    setApiVersion(apiVersion) {
        var headers = Backbone.$.ajaxSetup().headers || {};

        if (apiVersion) {
            headers["X-API-VERSION"] = apiVersion;
        }
        else {
            delete headers["X-API-VERSION"];
        }

        Backbone.$.ajaxSetup(Backbone.$.ajaxSettings, {
            headers
        });
    },

    login(username, password) {
        var headers = Backbone.$.ajaxSetup().headers || {};

        headers["Authorization"] = 'Basic ' + btoa(username + ':' + password);
        delete headers["X-API-KEY"];

        Backbone.$.ajaxSetup(Backbone.$.ajaxSettings, {
            headers
        });

        var currentUser = CollectionPool.getCollection(UserCollection).get("me", true);
        currentUser.fetch({
            success: (me) => {
                currentUser = me;
                this.setApiKey(me.get("apiKey"));

                this.trigger("user.login", me);
            }
        });
    },

    logout() {
        this.setApiKey();
        currentUser = null;

        this.trigger("user.logout");
    }
};

var sdkInitialized;
if (!sdkInitialized) {
    _.extend(XolaBackboneSDK, Backbone.Events);

    XolaBackboneSDK.setBaseUrl("http://xola.local/api");
    XolaBackboneSDK.setApiVersion("2017-09-13");

    sdkInitialized = true;
}

module.exports = XolaBackboneSDK;