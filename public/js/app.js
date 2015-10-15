(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var $         = window.$;
var ListView  = require('./views/List');

$(function() {
    new ListView();
});

},{"./views/List":5}],2:[function(require,module,exports){
"use strict";

var $        = window.$;
var Backbone = window.Backbone;
Backbone.$   = $;
var Common   = require('../common');
var Product  = require('../models/Product');

var Products = Backbone.Collection.extend({
    model: Product,
    url: Common.URL + 'product?status=IN',

    // inStock: function(){
    //     return this.filter(function(product) {
    //         return product.get('inventory');
    //     });
    // },

    comparator: function(product) {
        return product.get('order');
    }
});

module.exports = new Products();

},{"../common":3,"../models/Product":4}],3:[function(require,module,exports){
"use strict";

var Common = {
    ENTER_KEY: 13,
    FILTER: "",
    URL: 'http://api.malobarba.com/api/'
};

module.exports = Common;

},{}],4:[function(require,module,exports){
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

},{"../common.js":3}],5:[function(require,module,exports){
"use strict";

var $ = window.$;
var Backbone = window.Backbone;
Backbone.$ = $;

var Common = require('../common');
var Products = require('../collections/Products');
var ProductView = require('./Product.js');

module.exports = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: '#storeApp',

    // New
    // Delegated events for creating new items, and clearing completed ones.
    events: {
        // 'keypress #new-todo': 'createOnEnter',
        // 'click #clear-completed': 'clearCompleted',
        // 'click #toggle-all': 'toggleAllComplete'
    },

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {
        // this.allCheckbox = this.$('#toggle-all')[0];
        // this.$input = this.$('#new-todo');
        this.$footer = this.$('#footer');
        this.$main = this.$('#storeApp');

        this.listenTo(Products, 'add', this.addOne);
        this.listenTo(Products, 'reset', this.addAll);

        // New
        this.listenTo(Products, 'filter', this.filterAll);
        this.listenTo(Products, 'all', this.render);
        Products.fetch({reset:true});
    },

    // New
    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
        render: function() {

        if (Products.length) {
            this.$main.show();
            this.$footer.show();
        } else {
            this.$main.hide();
            this.$footer.hide();
        }
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(product) {
        var view = new ProductView({
            model: product
        });
        $('#productList').append(view.render().el);
    },

    // Add all items in the **Todos** collection at once.
    addAll: function() {
        this.$('#productList').html('');
        Products.each(this.addOne, this);
    },

    // New
    filterOne: function(product) {
        // product.trigger('visible');
    },

    // New
    filterAll: function() {
        Products.each(this.filterOne, this);
    },


    // New
    // Generate the attributes for a new Todo item.
    newAttributes: function() {
        return {
            name: this.$input.val().trim(),
        };
    },

    // New
    // If you hit return in the main input field, create new Todo model,
    // persisting it to localStorage.
    createOnEnter: function(event) {
        if (event.which !== Common.ENTER_KEY || !this.$input.val().trim()) {
            return;
        }
        Products.create(this.newAttributes());
        this.$input.val('');
    }
});

},{"../collections/Products":2,"../common":3,"./Product.js":6}],6:[function(require,module,exports){
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

},{"../common.js":3}]},{},[1])


//# sourceMappingURL=app.js.map
