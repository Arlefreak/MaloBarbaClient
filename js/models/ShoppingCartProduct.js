"use strict";

var $ = window.$;
var Backbone = window.Backbone;
var Common = require('../common.js');
Backbone.$ = $;

module.exports = Backbone.Model.extend({
    urlRoot: Common.URL + 'shoppingCartProduct',
    defaults: {
        pk: 0,
        client: 0,
        product: 0,
        cuantity: 0
    },

    url: function() {
        return this.urlRoot + '/' + this.pk;
    }
});
