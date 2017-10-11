import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Repository} from '../../../api/repository/repository.js';
import { Collections} from '../../../api/collections/collections.js';
import { Properties} from '../../../api/properties/properties.js';
import { Item } from '../../../api/item/item.js';

import './viewItem.html';

Template.viewItem.onCreated(function () {
    var self = this;
    self.autorun(function () {
        var slug = FlowRouter.getParam('slug');
        var slug_item = FlowRouter.getParam('item');
        self.subscribe('getRepository');
        self.subscribe('item.getItem', slug_item);
        var handle = self.subscribe('singleCollection', slug);
        if (handle.ready()) {
            var collection = Collections.findOne({slug: slug});
            var repository = Repository.findOne();
            if (collection.properties) {
                self.subscribe("properties.get-properties", collection.properties);
                self.subscribe("properties.get-properties", repository.properties);
            }
        }
    });
    this.getItem = function(){
        return Item.findOne();
    };
    this.getCollection = function () {
        var slug = FlowRouter.getParam('slug');
        return Collections.findOne({slug: slug});
    };
    this.getRepository = function () {
        return Repository.findOne();
    };
    this.getRepositroPropertiesTab = function (tab) {
        var slug = FlowRouter.getParam('slug');
        var collection = Collections.findOne({slug: slug});
        var repository = Repository.findOne();
        var ids_default = [];
        var ids = [];
        $.each(repository.properties, function (index_property, property_id) {
            if (repository.fixed_properties_data && repository.fixed_properties_data.length > 0) {
                var has_tab_collection = false;
                $.each(repository.fixed_properties_data, function (index, object) {
                    if (object.collection_id == collection._id && object.tab == tab) {
                        has_tab_collection = true;
                        ids.push(property_id);
                    }
                });
                if (!has_tab_collection)
                    ids_default.push(property_id);
            } else {
                ids_default.push(property_id)
            }
        });
        if (tab == 'default')
            return ids_default;
        else
            return ids;
    };
});

Template.viewItem.helpers({
    getItem:function(){
        return Item.findOne();
    },
    getWidget: function () {
        var item = this.item;
        var property = this.property;
        var repository = Repository.findOne();
        if(repository.properties.indexOf(property._id)>=0){
            switch(property.slug){
                case TAPi18n.__('title'):
                    return 'titleWidget';
                case TAPi18n.__('description'):
                    return 'descriptionWidget';   
                case TAPi18n.__('thumbnail'):
                    return 'thumbnailWidget';  
                case TAPi18n.__('attachmentes'):
                    return 'attachmentWidget';
            }
        }else{
             switch(property.type){
                case 'text':
                    return 'textWidget';
                case 'relationship':
                    return 'relationshipWidget';   
                case 'term':
                    return 'termWidget';  
                case 'compound':
                    return 'compoundWidget';
            }
        }
    },
    listTabs: function () {
        var instance = Template.instance();
        var collection = instance.getCollection();
        if (collection.tabs && collection.tabs.length > 0) {
            return collection.tabs;
        } else {
            return [];
        }
    },
    listProperties: function (tab) {
        var instance = Template.instance();
        var ids = instance.getRepositroPropertiesTab(tab)
        return Properties.find({$or: [{tab: tab}, {_id: {$in: ids}}]}).fetch();
    }
});
  