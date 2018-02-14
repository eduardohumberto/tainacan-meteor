import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Collections } from '../collections/collections.js';
import { Categories } from '../categories/categories.js';
import { Item } from '../item/item.js';
import { Properties } from '../properties/properties.js';
import { Repository } from '../repository/repository.js';
import { Random } from 'meteor/random';
import { _ } from 'meteor/underscore';

Meteor.methods({
    'tools.clearAll': function (clear) {
        var user_id = this.userId;
        var collections = Collections.find().fetch();
        if(collections){
             _.each(collections, function(collection){
                if(collection && collection.owner == user_id) 
                    Collections.remove(collection._id);
            });
        }
        var properties = Properties.find().fetch();
        if(properties){
             _.each(properties, function(property){
                if(property && property.owner == user_id)
                   Properties.remove(property._id);
            });
        }
        var items = Item.find().fetch();
        if(items){
             _.each(items, function(item){
                if(item && item.owner == user_id)  
                    Item.remove(item._id);
            });
        }
        return true;
    },
    'tools.populate': function (tools) {
        // Make sure the user is logged in before inserting a task
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        for (var j = 0; j < tools.collections; j++) {
            var arrayProperties = [];
            for (var i = 0; i < tools.metadataText; i++) {
                var slug = Random.id();
                var property_id = Properties.insert({
                    name: 'Metadado ' + i + ' - ' + slug,
                    createdAt: new Date(),
                    owner: this.userId,
                    slug: slug,
                    type: 'text',
                    tab: 'default'
                });
                arrayProperties.push(property_id);
            }
            var random_id = Random.id();
            var collection_id = Collections.insert({
                title: 'Colecao ' + j + ' - ' + random_id,
                createdAt: new Date(),
                owner: this.userId,
                status: 'publish',
                slug: random_id,
                properties: arrayProperties,
                tabs: [{
                        id: 'default',
                        name: 'Padrão'
                    }]
            });
            for (var k = 0; k < tools.items; k++) {
                var slug = Random.id();
                var propertiesValues = [];
                for (var l = 0; l < arrayProperties.length; l++) {
                    var object = {};
                    object[0] = 'Valor inserido ' + Random.id();
                    propertiesValues.push({"_id": arrayProperties[l], index: 0, values: object});
                }
                Item.insert({
                    title: 'Item ' + k + ' - ' + slug,
                    createdAt: new Date(),
                    owner: this.userId,
                    slug: random_id,
                    status: 'publish',
                    properties: propertiesValues,
                    collection_init: collection_id
                });
            }

        }
        return true;
    }
});
