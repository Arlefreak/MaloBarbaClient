"use strict";

var $ = window.$;
var Backbone = window.Backbone;
var Common = require('../common.js');
Backbone.$ = $;

module.exports = Backbone.Model.extend({
    urlRoot: Common.URL + 'tag',
    defaults: {
        pk: 0,
        name: ''
    },

    url: function() {
        return this.urlRoot + '/' + this.pk;
    }
});
