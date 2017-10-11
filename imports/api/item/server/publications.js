import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { FindFromPublication } from 'meteor/percolate:find-from-publication';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Item } from '../item.js';
import { Collections } from  '../../collections/collections.js'

//cria o item ao entrar na pagina
Meteor.publish('item.create-item-draft', function () {
    var item_id = Item.insert({
        createdAt: new Date(),
        owner: this.userId,
        status: 'draft',
        properties: []
    });
    return Item.find({
        _id: item_id});
});

Meteor.publish('item.getItem', function (slug) {
   if(slug){
       return Item.find({slug: slug});
   }else{
     return this.ready();
   }
  });

Meteor.publish('item.getThumbnail', function (id) {
   var item = Item.findOne({_id: id});
   if(item.thumbnail){
       return itemImages.collection.find({_id: item.thumbnail});
   }else{
     return this.ready();
   }
  });

Meteor.publish('item.getAttachments', function (id) {
    var item = Item.findOne({_id: id});
   if(item.attachments){
       return itemImages.collection.find({_id: { $in:item.attachments }});
   }else{
     return this.ready();
   }
  });


  FindFromPublication.publish('item.listItems', function (search,skipCount,showItems) {
    var collection =  Collections.findOne({"slug": search.collectionSlug});
    if(skipCount < 0){
        return [];
    }
    if(search.search){
      // Counts.publish(this, 'itemsCount', Item.find({collection_init: collection._id,title:search.search}), {
      //   noReady: true
      // });


      return Item.find({collection_init: collection._id,title:search.search}, {
        limit: parseInt(showItems),
        skip: parseInt(skipCount)
      });
    }else{
      // Counts.publish(this, 'itemsCount', Item.find({collection_init: collection._id}), {
      //   noReady: true
      // });

      return Item.find({collection_init: collection._id}, {
        limit: parseInt(showItems),
        skip: parseInt(skipCount)
      });
    }
    return this.ready();
    //return Item.find({collection_init: collection._id});
});
