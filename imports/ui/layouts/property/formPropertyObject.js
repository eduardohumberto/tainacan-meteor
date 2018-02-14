

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Collections} from '../../../api/collections/collections.js';
import { Categories} from '../../../api/categories/categories.js';

import { displayError } from '../../lib/errors.js';
import './formPropertyObject.html';

Template.formPropertyObject.onCreated(function () {
    var self = this;
    self.autorun(function () {
        var handle = self.subscribe('categories.getRootCategories');
        if (Meteor.user() && Meteor.user()._id) {
            handle = self.subscribe('categories.user-categories', Meteor.user()._id);
        }
        if (handle.ready()) {
            var taxonomy = Categories.findOne({slug: 'tainacan-taxonomy'});
            var category = Categories.findOne({slug: 'tainacan-category'});
            $("#objects_dynatree").dynatree({
                checkbox: true,
                selectionVisible: true, // Make sure, selected nodes are visible (expanded).  
                checkbox: true,
                children: Blaze._globalHelpers.generateJson(taxonomy,category,Categories,false),
                onSelect: function (flag, node) {
                    var values = ($('#taxonomyIdObject').val()== '') ? [] : $('#taxonomyIdObject').val().split(',') ;
                    if( values.indexOf( node.data.key ) >= 0){
                            $('#label-box-' + node.data.key).remove();
                            removed = values.splice(values.indexOf( node.data.key ) , 1);
                            $('#taxonomyIdObject').val(values.join(','));
                    }else{
                        add_label_box_object(node.data.key, node.data.title, '#selected_categories_object') ;
                         values.push(node.data.key);
                        $('#taxonomyIdObject').val(values.join(','));
                    }
                },
                onCreate: function (node, span) {
                   // bindContextMenu(span);
                }
            });
        }
    });
    this.getCategory = function(){
        var slug = FlowRouter.getParam('category');
        return (slug) ? Categories.findOne({slug: slug}) : false;
    }
    this.getCollection = function () {
        var slug = FlowRouter.getParam('slug');
        return (slug) ? Collections.findOne({slug: slug}) : false;
    }
});

Template.formPropertyObject.helpers({
    getTemplate: function () {
        var operation = Session.get('templateOperation');
        if (operation == 'text') {
            return 'formPropertyObject';
        }
    }
});

Template.formPropertyObject.events({
    'click .remove-label-box': function (event, instance) {
         $('#objects_dynatree').dynatree("getRoot").visit(function (node) {
            if(node.data.key === $(event.currentTarget).attr('id').replace('label-box-',''))
                node.select(false);
         });
         $(event.currentTarget).remove();
    },
    'submit #submit_form_property_object': function (event, instance) {
        event.preventDefault();
        if($('#taxonomyIdObject').val()==''){
            var error = {error: TAPi18n.__('property.create-property-object.empty-taxonomy')};
            displayError(error);
            return true;
        }

        var property = {
            name: $('#property_object_name').val().trim(),
            categories: $('#taxonomyIdObject').val().split(','),
            tab: (instance.$('#property_metadata_tab').length===0 ) ? 'default' : instance.$('#property_metadata_tab').val()
        };
        if(instance.getCategory())
            property['createdCategory'] = instance.getCategory()._id;
        // insere a propriedade de texto
        if (property.name != '') {
            $('#modal-property').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            Meteor.call('properties.insertObject', property, function (error, result) {
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



function add_label_box_object(id, name, seletor) {
    $(seletor).append('<span id="label-box-' + id + '" class="label label-primary remove-label-box">'
            + name + ' <a style="color:white;cursor:pointer;" class="remove-label-box">x</a></span>&nbsp;');
}