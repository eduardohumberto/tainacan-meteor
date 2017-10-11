import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Repository} from '../../../api/repository/repository.js';
import { Collections} from '../../../api/collections/collections.js';
import { Properties} from '../../../api/properties/properties.js';
import { Categories} from '../../../api/categories/categories.js';
import { displayError } from '../../lib/errors.js';

import './formCategory.html';

Template.formCategory.onCreated(function () {
    var self = this;
    self.autorun(function () {
    	var category = FlowRouter.getParam('category');
    	if(category){
    		var handle =self.subscribe('categories.single-category-slug',category);
    	}
    });

    this.getTaxonomyRoot = function(){
    	return this.data.taxonomyRoot;
    }

    this.isEdit = function(){
    	var is_edit = FlowRouter.getParam('category');
    	return (is_edit) ? true : false;
    }

    this.getCategory = function(){
    	var is_edit = FlowRouter.getParam('category');
    	return Categories.findOne({slug:is_edit});
    }
});


Template.formCategory.helpers({
	getParam: function(field){
         return (Template.instance().isEdit()) ? Template.instance().getCategory()[field] : '';
	},
	selectedPermission:function(value){
		if(Template.instance().isEdit()){
			return (value == Template.instance().getCategory().permission) ? 'selected' : '';
		}else{
			return (value == 'private') ? 'selected' : '';
		}
	},
    isEdit:function(value){
        return Template.instance().isEdit();
    }
});

Template.formCategory.events({
	'submit #submit_form_category': function (event, instance) {
        event.preventDefault();
        var parent = ($('#category_parent_id').val().trim()==='' || $('#category_parent_id').val().trim() === '0' ) ? instance.getTaxonomyRoot()._id : $('#category_parent_id').val().trim() ;

        var category = {
            name: $('#category_name').val().trim(),
            description: $('#category_description').val().trim(),
            permission: $('#category_permission').val(),
            parent: parent
        };
        // insere ou atualiza
        if (category.name != '' && !instance.isEdit()) {
            Meteor.call('categories.insert', category, function (error, result) {
                if (error) {
                    displayError(error);
                } else if (result) {
                    Bert.alert({title: TAPi18n.__('success'),
                        message: TAPi18n.__('formCategory.create-category-success'),
                        type: 'success',
                        style: 'growl-top-right',
                        icon: 'fa-check-square'});
                    instance.data.father.updateDynatreeRoot();
                }
            });
        }else if(category.name != '' && instance.isEdit()){
        	 Meteor.call('categories.updateField',instance.getCategory()._id, category, function (error, result) {
                if (error) {
                    displayError(error);
                } else if (result) {
                    Bert.alert({title: TAPi18n.__('success'),
                        message: TAPi18n.__('formCategory.update-category-success'),
                        type: 'success',
                        style: 'growl-top-right',
                        icon: 'fa-check-square'});
                    instance.data.father.updateDynatreeRoot();
                }
             });    
        } else {
            var error = {error: TAPi18n.__('formCategory.empty-name')};
            displayError(error);
        }
    },
    'click #js-show-category-property': function (event, instance) {
        $('#js-category-properties').toggle();
    }
});
