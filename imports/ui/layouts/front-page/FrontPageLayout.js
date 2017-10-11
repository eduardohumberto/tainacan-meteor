import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './FrontPageLayout.html';

Template.FrontPageLayout.onCreated(function(){
  this.getRandomImage = new ReactiveVar(Math.floor((Math.random() * 5) + 1));
});

Template.FrontPageLayout.helpers({
  getRandomImage:function(){
    return Template.instance().getRandomImage.get();
  }
});
