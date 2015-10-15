"use strict";

var $ = window.$;
var Backbone = window.Backbone;
var Common = require('../common.js');
Backbone.$ = $;

module.exports = Backbone.Model.extend({
    urlRoot: Common.URL + 'productImage',
    defaults: {
        pk: 0,
        product: 0,
        name: '',
        image: '',
        order: 0,
        date: '',
        updated: ''
    },

    url: function() {
        return this.urlRoot + '/' + this.pk;
    }
});
