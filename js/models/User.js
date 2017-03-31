"use strict";

var $ = window.$;
var Backbone = window.Backbone;
var Common = require('../common.js');
Backbone.$ = $;

module.exports = Backbone.Model.extend({
    urlRoot: Common.URL + 'user',
    defaults: {
        pk: 0,
        username: '',
        first_name: '',
        last_name: '',
        email: ''
    },

    url: function() {
        return this.urlRoot + '/' + this.pk;
    }
});
