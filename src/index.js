import _ from "underscore";
import Backbone from "backbone";

import { Config } from "./Config";

import { BaseModel } from "./BaseModel";
import { BaseCollection } from "./BaseCollection";

import { Demographic } from "./models/Demographic";
import { Experience } from "./models/Experience";
import { Event } from "./models/Event";
import { Order } from "./models/Order";
import { OrderDemographic } from "./models/OrderDemographic";
import { Payment } from "./models/Payment";
import { Seller } from "./models/Seller";
import { User } from "./models/User";

import { DemographicCollection } from "./collections/Demographics";
import { ExperienceCollection } from "./collections/Experiences";
import { EventCollection } from "./collections/Events";
import { OrderCollection } from "./collections/Orders";
import { OrderDemographicCollection } from "./collections/OrderDemographics";
import { UserCollection } from "./collections/Users";

import { CollectionPool } from "./CollectionPool";
import { Account } from "./services/Account";

const XolaBackboneSDK = {
    BaseModel: BaseModel,
    BaseCollection: BaseCollection,

    Model: {
        Demographic: Demographic,
        Experience: Experience,
        Event: Event,
        Order: Order,
        OrderDemographic: OrderDemographic,
        Payment: Payment,
        Seller: Seller,
        User: User
    },

    Collection: {
        Demographics: DemographicCollection,
        Experiences: ExperienceCollection,
        Events: EventCollection,
        Orders: OrderCollection,
        OrderDemographics: OrderDemographicCollection,
        Users: UserCollection
    },

    Service: {
        Account: Account
    },

    CollectionPool: CollectionPool,

    Config: Config,

    setUser(user) {
        Account.currentUser = user;
    },

    getUser() {
        return Account.currentUser;
    },

    login(username, password, options) {
        options = options || {};
        var beforeSend = options.beforeSend;
        var success = options.success;

        options.beforeSend = (jqXHR, settings) => {
            settings.crossDomain = true;

            jqXHR.setRequestHeader("Authorization", "Basic " + btoa(username + ':' + password));

            if (beforeSend) return beforeSend.call(this, jqXHR, settings);
        };
        options.success = (data, textStatus, jqXHR) => {
            if (success) success.call(this, data, textStatus, jqXHR);

            this.trigger("user.login", data);
        };

        Account.currentUser = new User({id: "me"});
        Account.currentUser.fetch(options);

        return Account.currentUser;
    },

    logout() {
        Account.currentUser = null;

        this.trigger("user.logout");
    }
};

var sdkInitialized;
if (!sdkInitialized) {
    _.extend(XolaBackboneSDK, Backbone.Events);
    sdkInitialized = true;
}

module.exports = XolaBackboneSDK;