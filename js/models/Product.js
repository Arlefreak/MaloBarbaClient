"use strict";

var $ = window.$;
var Backbone = window.Backbone;
var Common = require('../common.js');
Backbone.$ = $;

module.exports = Backbone.Model.extend({
    urlRoot: Common.URL + 'product',
    defaults: {
        pk: -1,
        sku: '',
        name: '',
        image: '',
        description: '',
        price: 0,
        discount: 0,
        inventory: 0,
        status: '',
        tags: [],
        category: '',
        date: '',
        updated: '',
        order: 0,
        url: ''
    },

    url: function() {
        return this.urlRoot + '/' + this.pk;
    },
});
