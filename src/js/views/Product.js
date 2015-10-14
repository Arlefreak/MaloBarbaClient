"use strict";

var $        = window.$;
var Backbone = window.Backbone;
var _        = window._;
Backbone.$   = $;

var Common   = require('../common.js');

module.exports = Backbone.View.extend({

    //... is a list tag.
    tagName: 'li',

    // Cache the template function for a single item.
    template: _.template($('#product-template').html()),

    // The DOM events specific to an item.
    events: {
        // 'click .toggle': 'togglecompleted', // NEW
        // 'dblclick label': 'edit',
        // 'click .destroy': 'clear', // NEW
        // 'keypress .edit': 'updateOnEnter',
        // 'blur .edit': 'close'
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove); // NEW
        // this.listenTo(this.model, 'visible', this.toggleVisible); // NEW
    },

    // Re-render the titles of the todo item.
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        this.$input = this.$('.edit');
        return this;
    },

    // NEW - Toggles visibility of item
    toggleVisible: function() {
        this.$el.toggleClass('hidden', this.isHidden());
    },

    // NEW - Determines if item should be hidden
    isHidden: function() {
        var stock = this.model.get('stock');
        return ( // hidden cases only
            (!stock && Common.FILTER === 'stock') || (stock && Common.FILTER === 'stock')
        );
    },

    // NEW - Remove the item, destroy the model from *localStorage* and delete its view.
    clear: function() {
        this.model.destroy();
    }
});
