import './descriptionWidget.html';

Template.descriptionWidget.onCreated(function () {
    this.getItem = function(){
        return this.data.item;
    };
    this.getProperty = function(){
        return this.data.property;
    }
});


Template.descriptionWidget.helpers({
    
});

Template.descriptionWidget.events({
  'keyup .js-save-desc': function( event, template ) {
      var desc = template.$('.js-save-desc').val();
      Meteor.call('item.updateField', template.getItem()._id,{desc:desc});
  }
});