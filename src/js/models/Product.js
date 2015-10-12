"use strict";

var $        = window.$;
var Backbone = window.Backbone;
var _        = window._;
var Common   = require('../common');
Backbone.$   = $;

module.exports = Backbone.Model.extend({
  defaults: {
    title: 'test',
    completed: false
  },

  toggle: function() {
    this.save({
      completed: !this.get('completed')
    });
  }
});
