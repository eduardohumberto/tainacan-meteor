import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Collections} from '../../../api/collections/collections.js';
import './singleListCollection.html';


Template.singleListCollection.onCreated(function () {
    var self = this;
    self.autorun(function () {
        self.subscribe('singleCollection', self.data.slug);
        self.subscribe('getThumbnail', self.data.slug);
    });
});

Template.singleListCollection.helpers({
  getThumbnail:function(){
      var id = Template.instance().data.slug;
      let collection = Collections.findOne({slug: id});
      var back;
      if (collection.thumbnail) {
          collectionImages.find({_id: collection.thumbnail}).forEach(function(row){
             back = row;
          });
          return back;
      }
  },
  getOwner:function(){
      return Meteor.users.findOne().emails[0].address;
  },
  getDate:function(data){
    return data.getDate() + "/" + (data.getMonth()+1) + "/" + data.getFullYear();
  },
  hasThumbnail: function () {
      var id = Template.instance().data.slug;
      var collection = Collections.findOne({slug: id});
      if (collection.thumbnail) {
          return true;
      } else {
          return false;
      }
  },
  getTitleFirstLetter:function(title){
      return title[0].toUpperCase();
  }
});
