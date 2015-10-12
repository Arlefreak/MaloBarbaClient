"use strict";

var $           = window.$;
var Backbone    = window.Backbone;
var _           = window._;
Backbone.$      = $;

var Common      = require('../common');
var Products    = require('../collections/Products');

var ProductRouter = Backbone.Router.extend({
    routes:{
        '*filter': 'setFilter'
    },

    setFilter: function( param ) {
        // Set the current filter to be used
        if (param) {
            param = param.trim();
        }
        Common.FILTER = param || '';
        console.log(param);

        // Trigger a collection filter event, causing hiding/unhiding
        // of Todo view items
        Products.trigger('filter');
    }
});

module.exports = new ProductRouter();
Backbone.history.start();
