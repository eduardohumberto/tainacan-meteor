import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Repository} from '../../../api/repository/repository.js';
import { Collections} from '../../../api/collections/collections.js';
import { Properties} from '../../../api/properties/properties.js';
import { Categories} from '../../../api/categories/categories.js';

import './propertyContainer.html';

Template.propertyContainer.onCreated(function () {
    var self = this;
    self.autorun(function () {
        var category = FlowRouter.getParam('category');
        var handle =self.subscribe('categories.single-category-slug',category);
        if (handle.ready()) {
            var category = Categories.findOne({slug: category});
            if (category.properties) {
                self.subscribe("properties.get-properties", category.properties);
            }
        }
    });
});



Template.propertyContainer.helpers({
    getTemplate: function () {
        var operation = Session.get('templateOperation');
        if (operation == 'text') {
            return 'formPropertyData';
        }
        // note that we return a Template object, not a string
    },
    listProperties: function (tab) {
        var instance = Template.instance();
        return Properties.find().fetch();
    }
});

Template.propertyContainer.events({
    "click .dropdown-toggle":function(event, template){
        template.$('.add-property-dropdown').toggle();
    },
    "click .add-new-property-text": function (event, template) {
        template.$('.add-property-dropdown').toggle();
        //Session.set('newProperty', true);
        $('#modal-property').modal('show');
        $('.dropdown-toggle').dropdown()
        Session.set('templateOperation', 'text');
    },
    "click .cancel-add-new-property": function (event, template) {
        //Session.set('newProperty', false);
        $('#modal-property').modal('hide');
        $('.dropdown-toggle').dropdown()
        Session.set('templateOperation', 'text');
    }
});
