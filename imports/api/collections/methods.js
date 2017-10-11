import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Collections } from './collections.js';
import { Categories } from '../categories/categories.js';
import { Random } from 'meteor/random';

Meteor.methods({
  'collection.insert':function(text){
      check(text, String);
      // Make sure the user is logged in before inserting a task
       if (! this.userId) {
         throw new Meteor.Error('not-authorized');
       }

       var slug = text.toLowerCase()
                      .replace(/[^\w ]+/g,'')
                      .replace(/ +/g,'-');
      var data = Collections.findOne({"slug": slug});
      if (data) {
         throw new Meteor.Error('slug-already-exist');
      }
      var id = Collections.insert({
         title:text,
         createdAt: new Date(),
         owner: this.userId,
         status: 'publish',
         slug:slug,
         properties:[],
         tabs:[{
           id:'default',
           name:'Default'
         }]
       });
      var collection = Collections.findOne(id);
      collection.insertRootCategory(this.userId,text,id);
       return slug;
   },
   /***** UPDATES *****/
   'collection.updateField':function(id,value){
      Collections.update(id,{$set:value});
    },
   'collection.remove':function(id) {
      const collection = Collections.findOne(id);
      if (collection.owner !== this.userId) {
        // If the task is private, make sure only the owner can delete it
        throw new Meteor.Error('not-authorized');
      }
      Collections.remove(id);
   },
   'collection.add-property':function(collection_id,id){
      const collection = Collections.findOne(collection_id);
      if(collection.properties && collection.properties.indexOf(id)<0){
        Collections.update(
           { _id: collection_id},
           { $push: { properties: id }}
          );
      }
   },
   'collection.remove-property':function(collection_id,id){
     const collection = Collections.findOne(collection_id);
     if(collection.properties && collection.properties.indexOf(id)>=0){
       Collections.update(
          { _id: collection_id},
          { $pull: { properties: id }}
         );
     }
   }

});
