import $ from "jquery";
import Backbone from "backbone";
import Config from "./Config";

import Experience from "./Model/Experience";

module.exports = {
    Model: {
        Experience: Experience
    },
    Collection: {

    },
    init(options) {
        Config.BASE_URL = options.BASE_URL || 'https://xola.com/api';

        if (options.hasOwnProperty('API_KEY')) {
            var headers = Backbone.$.ajaxSetup().headers || {};
            headers["X-API-KEY"] = options['API_KEY'];
            $.ajaxSetup($.ajaxSettings, {
                headers
            });
        }
    }
}