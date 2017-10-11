import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './collectionHeader.js';
import './collectionMenuLeft.js';
import './collectionPage.html';


Template.collectionPage.helpers({
    linkCreateItemText: function () {
        var id = FlowRouter.getParam('slug');
        return id + '/criar-item';
    }
  });


  Template.collectionPage.events({
      'click .js-search-items': function (e, template) {
         var slug = FlowRouter.getParam('slug');
          Meteor.subscribe('item.listItems', {collectionSlug:slug,search:$('#search_objects').val()},0,10);
      }
  });
