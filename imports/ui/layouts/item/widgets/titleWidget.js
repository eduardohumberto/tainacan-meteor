import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import './titleWidget.html';

Template.titleWidget.onCreated(function () {
    this.getItem = function(){
        return this.data.item;
    };
    this.getProperty = function(){
        return this.data.property;
    }
});

Template.titleWidget.onRendered(function () {
  $(".multiple-items-accordion").accordion({
        active: false,
        collapsible: true,
        header: "h2",
        heightStyle: "content",
        beforeActivate: function(event, ui) {
                // The accordion believes a panel is being opened
               if (ui.newHeader[0]) {
                   var currHeader  = ui.newHeader;
                   var currContent = currHeader.next('.ui-accordion-content');
                // The accordion believes a panel is being closed
               } else {
                   var currHeader  = ui.oldHeader;
                   var currContent = currHeader.next('.ui-accordion-content');
               }
                // Since we've changed the default behavior, this detects the actual status
               var isPanelSelected = currHeader.attr('aria-selected') == 'true';

                // Toggle the panel's header
               currHeader.toggleClass('ui-corner-all',isPanelSelected).toggleClass('accordion-header-active ui-state-active ui-corner-top',!isPanelSelected).attr('aria-selected',((!isPanelSelected).toString()));

               // Toggle the panel's icon
               currHeader.children('.ui-icon').toggleClass('ui-icon-triangle-1-e',isPanelSelected).toggleClass('ui-icon-triangle-1-s',!isPanelSelected);

                // Toggle the panel's content
               currContent.toggleClass('accordion-content-active',!isPanelSelected)
               if (isPanelSelected) { currContent.slideUp(); }  else { currContent.slideDown(); }

               return false; // Cancels the default action
           }

    });
});


Template.titleWidget.helpers({

});

Template.titleWidget.events({
  'keyup .js-save-title': function( event, template ) {
      var title = template.$('.js-save-title').val();
      var  isEdit = ( FlowRouter.getParam('item') ) ? FlowRouter.getParam('item') : false;
      Meteor.call('item.updateTitle', template.getItem()._id,title,isEdit);
  }
});
