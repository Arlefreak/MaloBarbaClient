"use strict";

var $ = window.$;
var Backbone = window.Backbone;
var Common = require('../common.js');
Backbone.$ = $;

module.exports = Backbone.Model.extend({
    urlRoot: Common.URL + 'category',
    defaults: {
        pk: 0,
        name: '',
        image: '',
        date: '',
        updated: '',
        order: 1
    },

    url: function() {
        return this.urlRoot + '/' + this.pk;
    }
});
