import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Collections} from '../collections.js';

Meteor.publish('my-collections', function() {
  return Collections.find({
    owner: this.userId });
});
//busca a colecao
Meteor.publish('singleCollection', function(slug) {
  check(slug,String);
  var collection = Collections.find({slug: slug});
  var owner = Meteor.users.find({_id:  { $in:[collection.owner] }});
  return [collection,owner];
});

Meteor.publish('getThumbnail', function (slug) {
  console.log('getThumbnail',slug);
   var collection = Collections.findOne({slug: slug});
   if(collection.thumbnail){
       return collectionImages.collection.find({_id: collection.thumbnail});
   }else{
     return this.ready();
   }
  });

Meteor.publish('getCover', function (slug) {
   var collection = Collections.findOne({slug: slug});
   if(collection.cover){
       return collectionImages.collection.find({_id: collection.cover});
   }else{
     return this.ready();
   }
  });

  Meteor.publish('listCollections', function() {
    return Collections.find({
      status: 'publish' });
  });


Meteor.publish('files.images.all', function () {
    return collectionImages.collection.find({});
  });
