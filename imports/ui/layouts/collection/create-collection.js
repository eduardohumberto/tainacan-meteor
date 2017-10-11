import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { TAPi18n } from 'meteor/tap:i18n';

import './create-collection.html';


Template.createCollection.onCreated(function(){
  this.getRandomImage = new ReactiveVar(Math.floor((Math.random() * 5) + 1));
});

Template.createCollection.events({
  'submit #form_new_collection':function(event){
      event.preventDefault();
      var target = $('#collection_name').val().trim();
      // Insert a task into the collection
      if(target!=''){
          Meteor.call('collection.insert', target, function(error, result){
              
            if(error){
                if(error.error==='slug-already-exist'){
                    Bert.alert( {title: TAPi18n.__('attention'),
                        message: TAPi18n.__('collection.create-collection.name-exist'),
                        type: 'danger',
                        style: 'growl-top-right',
                        icon: 'fa-warning' });
                }else if(error.error==='not-authorized'){
                    Bert.alert( {title: TAPi18n.__('attention'),
                            message: TAPi18n.__('not-authorized'),
                            type: 'danger',
                            style: 'growl-top-right',
                            icon: 'fa-warning' });
                }
            }else if(result){
                   Bert.alert( {title: TAPi18n.__('success'),
                        message: TAPi18n.__('collection.create-collection.success'),
                        type: 'success',
                        style: 'growl-top-right',
                        icon: 'fa-check-square' });
                   FlowRouter.go('/'+result);
            }
          });
      }else{
          Bert.alert( {title: TAPi18n.__('attention'),
                        message: TAPi18n.__('collection.create-collection.empty'),
                        type: 'danger',
                        style: 'growl-top-right',
                        icon: 'fa-warning' });
      }
  }
});