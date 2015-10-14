'use strict';
var $         = window.$;
var ListView  = require('./views/List');

$(function() {
    var products = [
        {name:"test1"},
        {name:"test1"},
        {name:"test1"},
        {name:"test1"},
        {name:"test1"},
        {name:"test1"},
        {name:"test1"},
        {name:"test1"},
    ]
    new ListView(products);
});
