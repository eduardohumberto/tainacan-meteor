import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Collections} from '../../../api/collections/collections.js';
import { Item } from '../../../api/item/item.js';
import { Counts } from 'meteor/tmeasday:publish-counts';


import './view_modes/modeCards.js';
import './collectionListItem.html';

Template.collectionListItem.onCreated(function () {
    var self = this;
    self.autorun(function () {
        var slug = FlowRouter.getParam('slug');
        var currentPage = parseInt(FlowRouter.getParam('page')) || 1;
        var skipCount = (currentPage - 1) * 10
        console.log('here');
        self.subscribe('singleCollection', slug);
        console.log('item.listItems');
        self.subscribe('item.listItems', {collectionSlug:slug},skipCount,10);
    });

    this.getCollection = function () {
        return Collections.findOne();
    };

    this.ListItems = function(){
        var skipCount = (currentPage - 1) * 10;
       return Item.findFromPublication('item.listItems');
    };
});

Template.collectionListItem.helpers({
    getViewMode: function () {
        var collection = Template.instance().getCollection();
        if(collection.view_mode_items){
            return collection.view_mode_items;
        }else{
            return 'modeCards';
        }
    },
    listItems: function(){
        console.log('times that was called');
        const instance = Template.instance();
        return instance.ListItems();
    },
    getArgs: function(item) {
        const instance = Template.instance();
        return {
          item:item,
          collection: instance.getCollection()
        };
    },
    nextPage: function() {
        var currentPage = parseInt(FlowRouter.getParam('page')) || 1;
        var nextPage = hasMorePages() ? currentPage + 1 : currentPage;
        return '/'+FlowRouter.getParam('slug')+'/p/'+nextPage;
    },
    prevPage: function() {
        var previousPage = currentPage() === 1 ? 1 : currentPage() - 1;
        return '/'+FlowRouter.getParam('slug')+'/p/'+previousPage;
    },
    prevPageClass: function() {
        return currentPage() <= 1 ? "disabled" : "";
    },
    nextPageClass: function() {
        return hasMorePages() ? "" : "disabled";
    }
});



var hasMorePages = function() {
  var currentPage = parseInt(FlowRouter.getParam('page')) || 1;
  var totalItems = Counts.get('itemsCount');
  return currentPage * 10 < totalItems;
}

var currentPage = function() {
  var currentPage = parseInt(FlowRouter.getParam('page')) || 1;
  return currentPage;
}
