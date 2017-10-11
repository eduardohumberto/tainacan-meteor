import './formPropertyData.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Collections} from '../../../api/collections/collections.js';
import { Categories} from '../../../api/categories/categories.js';

import { displayError } from '../../lib/errors.js';


Template.formPropertyData.onCreated(function () {
    this.getCategory = function(){
        var slug = FlowRouter.getParam('category');
        return (slug) ? Categories.findOne({slug: slug}) : false;
    }
    this.getCollection = function () {
        var slug = FlowRouter.getParam('slug');
        return (slug) ? Collections.findOne({slug: slug}) : false;
    }
});

Template.formPropertyData.helpers({
    getTemplate: function () {
        var operation = Session.get('templateOperation');
        if (operation == 'text') {
            return 'formPropertyData';
        }
    }
});

Template.formPropertyData.events({
    'click .js-list-properties': function (event, instance) {
         Session.set('newProperty', false);
    },
    'submit #submit_form_property_data': function (event, instance) {
        event.preventDefault();
        var property = {
            name: $('#property_data_name').val().trim(),
            type: $('#property_metadata_type').val().trim(),
            tab: (instance.$('#property_metadata_tab').length===0 ) ? 'default' : instance.$('#property_metadata_tab').val()
        };
        if(instance.getCategory())
            property['createdCategory'] = instance.getCategory()._id;
        // insere a propriedade de texto
        if (property.name != '') {
            $('#modal-property').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            Meteor.call('properties.insertData', property, function (error, result) {
                if (error) {
                    displayError(error);
                } else if (result && instance.getCollection()) {
                    var collection = instance.getCollection();
                    Meteor.call('collection.add-property', collection._id, result);
                    Bert.alert({title: TAPi18n.__('success'),
                        message: TAPi18n.__('property.create-property-success'),
                        type: 'success',
                        style: 'growl-top-right',
                        icon: 'fa-check-square'});
                    //Session.set('newProperty', false);
                }else if(result && instance.getCategory()){
                    var category = instance.getCategory();
                    Meteor.call('categories.add-property', category._id, result);
                    Bert.alert({title: TAPi18n.__('success'),
                        message: TAPi18n.__('property.create-property-success'),
                        type: 'success',
                        style: 'growl-top-right',
                        icon: 'fa-check-square'});
                    //Session.set('newProperty', false); 
                }
            });
        } else {
            var error = {error: TAPi18n.__('property.create-property.empty')};
            displayError(error);
        }
    }
});
