import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Repository } from './repository.js';
import { Random } from 'meteor/random';

Meteor.methods({
   /***** UPDATES *****/
   'repository.updateField':function(id,value){
      Repository.update(id,{$set:value});
    },
   'repository.add-property':function(id){
      const repository = Repository.findOne({slug:'tainacan-repository'});
      if(repository.properties && repository.properties.indexOf(id)<0){
        Repository.update(
           { _id: repository._id},
           { $push: { properties: id }}
          );
      }
   },
   'repository.remove-property':function(id){
     const repository = Repository.findOne({slug:'tainacan-repository'});
     if(repository.properties && repository.properties.indexOf(id)>=0){
       Collections.update(
          { _id: repository._id},
          { $pull: { properties: id }}
         );
     }
   }

});
