import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Item } from './item.js';
import { Random } from 'meteor/random';

Meteor.methods({
    'item.updateTitle':function(id,title,is_edit){
        if (!this.userId) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
          }
      if(!is_edit){
          var slug = title.toLowerCase()
                      .replace(/[^\w ]+/g,'')
                      .replace(/ +/g,'-');
          var data = Item.findOne({"slug": slug});
          if (data) {
             throw new Meteor.Error('slug-already-exist');
          }
          Item.update(id,{$set:{title:title,slug:slug}});
       }else{
          Item.update(id,{$set:{title:title}});
       }
    },
   /***** UPDATES *****/
   'item.updateField':function(id,value){
      return Item.update(id,{$set:value});
    },
   'item.remove':function(id) {
      const item = Item.findOne(id);
      if (item.owner !== this.userId) {
        // If the task is private, make sure only the owner can delete it
        throw new Meteor.Error('not-authorized');
      }
      if(item.status == 'publish'){
          throw new Meteor.Error('directly-removing-published-item');
      }
      Item.remove(id);
   },
   'item.updateProperty':function(id,property_id,value,index_compound,index_value){
        var object = {};
        object[index_value] = value;
        var has_inserted = Item.find({ "_id": id,"properties._id": property_id,"properties.index": index_compound}).fetch();
        if(!has_inserted || has_inserted.length == 0){
          Item.update(
                  { "_id": id },
                  { $push: { "properties":{ "_id":property_id, index:index_compound,values:object}}});
            console.log(Item.find({ "_id": id,"properties._id": property_id,"properties.index": index_compound}).fetch());
        }else{
          var item = has_inserted[0];
          console.log(item);
          for(var i = 0;i<item.properties.length;i++){
              var value = item.properties[i];
              if(value._id == property_id && value.index == index_compound){
                 var $set = {};
                 var position = "properties."+i+".values";
                 $set[position] = object;
                 console.log($set);
                 Item.update(
                         { "_id": id,"properties._id": property_id,"properties.index": index_compound},
                         { $set: $set});
              }
          }

        }
    }
});
