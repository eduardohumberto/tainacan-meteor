import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Repository} from '../../../api/repository/repository.js';
import { Collections} from '../../../api/collections/collections.js';
import { Properties} from '../../../api/properties/properties.js';

import './propertyCollectionPage.html';

Template.propertyCollectionPage.onCreated(function () {
    var self = this;
    self.autorun(function () {
        var slug = FlowRouter.getParam('slug');
        self.subscribe('getRepository');
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
    this.getCollection = function () {
        var slug = FlowRouter.getParam('slug');
        return Collections.findOne({slug: slug});
    }
    this.getRepository = function () {
        return Repository.findOne();
    }
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
    }
});


Template.propertyCollectionPage.helpers({
    getTemplate: function () {
        var operation = Session.get('templateOperation');
        if (operation == 'text') {
            return 'formPropertyData';
        }else if(operation == 'category'){
             return 'formPropertyTerm';
        }else if(operation == 'object'){
             return 'formPropertyObject';
        }
        // note that we return a Template object, not a string
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

Template.propertyCollectionPage.events({
    "click .add-new-property-text": function (event, template) {
        //Session.set('newProperty', true);
        $('#modal-property').modal('show');
        Session.set('templateOperation', 'text');
    },
    "click .add-new-property-term": function (event, template) {
        //Session.set('newProperty', true);
        $('#modal-property').modal('show');
        Session.set('templateOperation', 'category');
    },
    "click .add-new-property-object": function (event, template) {
        //Session.set('newProperty', true);
        $('#modal-property').modal('show');
        Session.set('templateOperation', 'object');
    },
    "click .cancel-add-new-property": function (event, template) {
        //Session.set('newProperty', false);
        $('#modal-property').modal('hide');
        Session.set('templateOperation', '');
    }
});
