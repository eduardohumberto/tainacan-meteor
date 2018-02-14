import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Repository} from '../../../api/repository/repository.js';
import { Collections} from '../../../api/collections/collections.js';
import { Properties} from '../../../api/properties/properties.js';
import { Item } from '../../../api/item/item.js';

import './formItem.html';
Template.formItem.onCreated(function () {
    this.isEdit = function(){
       var item_slug = ( FlowRouter.getParam('item') ) ? FlowRouter.getParam('item') : false;
       return item_slug;
    }
    var self = this;
    self.autorun(function () {
        var slug = FlowRouter.getParam('slug');
        //subscribe
        self.subscribe('getRepository');
        if(!self.isEdit())
            self.subscribe('item.create-item-draft');
        else
            self.subscribe('item.getItem',self.isEdit());
        var handle = self.subscribe('singleCollection', slug);
        if (handle.ready()) {
            var collection = Collections.findOne({slug: slug});
            var repository = Repository.findOne();
            if (collection.properties) {
                //self.subscribe("properties.get-properties", collection.properties);
                self.subscribe("properties.get-properties-form", repository.properties,collection.properties);
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



Template.formItem.onDestroyed(function () {
  // deregister from some central store
    if(!this.isEdit())
        Meteor.call('item.remove', this.getItem()._id);
});

Template.formItem.helpers({
    getItem:function(){
        return Item.findOne();
    },
    getWidget: function () {
        var item = this.item;
        var property = this.property;
        
        console.log('getWidget',property.type);
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
                case 'category':
                    return 'categoryWidget';
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


Template.formItem.events({
    'click .js-form-item-save': function (e, template) {
        Meteor.call('item.updateField', template.getItem()._id,{status:'publish',collection_init:template.getCollection()._id},function(error, result){
            if(error){
                if(error.error==='slug-already-exist'){
                    Bert.alert( {title: TAPi18n.__('attention'),
                        message: TAPi18n.__('form-item.create-collection.name-exist'),
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
                        message: TAPi18n.__('form-item.operation-successfully'),
                        type: 'success',
                        style: 'growl-top-right',
                        icon: 'fa-check-square' });
                   FlowRouter.go('/'+template.getCollection().slug+'/#collection-view-mode');
            }
        });

    }
});
