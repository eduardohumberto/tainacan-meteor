import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Repository} from '../../../api/repository/repository.js';
import { Collections} from '../../../api/collections/collections.js';
import { Properties} from '../../../api/properties/properties.js';
import { Categories} from '../../../api/categories/categories.js';
import { displayError } from '../../lib/errors.js';


import './categoriesManagementPage.html';

Template.categoriesManagementPage.onCreated(function () {
    var self = this;
    self.autorun(function () {
        var handle = self.subscribe('categories.getRootCategories');
        if (Meteor.user() && Meteor.user()._id) {
            handle = self.subscribe('categories.user-categories', Meteor.user()._id);
        }
        if (handle.ready()) {
            var taxonomy = Categories.findOne({slug: 'tainacan-taxonomy'});
            var category = Categories.findOne({slug: 'tainacan-category'});
            $("#categories_dynatree").dynatree({
                selectionVisible: true, // Make sure, selected nodes are visible (expanded).  
                checkbox: true,
                children: Blaze._globalHelpers.generateJson(taxonomy,category,Categories),
                onSelect: function (flag, node) {
                },
                onCreate: function (node, span) {
                    bindContextMenu(span);
                }
            });
        }
    });

    this.updateDynatreeRoot = function () {
        var taxonomy = Categories.findOne({slug: 'tainacan-taxonomy'});
         var category = Categories.findOne({slug: 'tainacan-category'});
        $("#categories_dynatree").dynatree("destroy");
        $("#categories_dynatree").dynatree({
            selectionVisible: true, // Make sure, selected nodes are visible (expanded).  
            checkbox: true,
            children: Blaze._globalHelpers.generateJson(taxonomy,category,Categories),
            onSelect: function (flag, node) {
            },
            onCreate: function (node, span) {
                bindContextMenu(span);
            }
        });
    }
});

Template.categoriesManagementPage.onRendered(function () {

});


Template.categoriesManagementPage.helpers({
    getArgs: function () {
        var category = Categories.findOne({slug: 'tainacan-taxonomy'});
        return {
            taxonomyRoot: category,
            father: Template.instance()
        };
    }
});

Template.categoriesManagementPage.events({
    'submit #submit_delete_category': function (event, instance) {
        event.preventDefault();
        var id = instance.$('#category_delete_id').val();
        if(id){
             Meteor.call('categories.remove',id, function (error, result) {
                $('#modalExcluirCategoriaUnique').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                if (error) {
                    displayError(error);
                } else if (result) {
                    Bert.alert({title: TAPi18n.__('success'),
                        message: TAPi18n.__('formCategory.update-category-success'),
                        type: 'success',
                        style: 'growl-top-right',
                        icon: 'fa-check-square'});

                    instance.updateDynatreeRoot();

                    FlowRouter.go('/administracao/categorias/');
                }
             });    
        }
    }
});



function bindContextMenu(span) {
    // Add context menu to this node:
    $(span).contextMenu({menu: "myMenu", trigger: 'hover'}, function (action, el, pos) {
        // The event was bound to the <span> tag, but the node object
        // is stored in the parent <li> tag
        var node = $.ui.dynatree.getNode(el);
        // console.log(node.data.key);
        switch (action) {
            case "add":
                FlowRouter.go('/administracao/categorias/');
                $("#category_name").val('');
                $("#chosen-selected2-user").html('');
                $("#category_parent_name").val(node.data.title);
                $("#category_parent_id").val(node.data.key);
                if (node.data.key == 'public_categories') {
                    $("#category_permission").val('public');
                } else {
                    $("#category_permission").val('private');
                }
                $("#category_id").val('');
                break;
            case "edit":
                var category = Categories.findOne({ _id:node.data.key})
                FlowRouter.go('/administracao/categorias/'+category.slug);
                break;
            case "delete":
                $('#category_property').html('');
                $("#category_delete_id").val(node.data.key);
                $("#delete_category_name").text(node.data.title);
                $('#modalExcluirCategoriaUnique').modal('show');
                $('.dropdown-toggle').dropdown();
                break;
            case "set_parent":
                if ($("#category_id").val() !== node.data.key && $("#category_id").val() != node.data.key) {
                    $("#category_parent_name").val(node.data.title);
                    $("#category_parent_id").val(node.data.key);
                } else {
                    //showAlertGeneral('<?php _e('Error', 'tainacan') ?>', '<?php _e("Invalid parent", 'tainacan') ?>', 'error');
                }
                $('.dropdown-toggle').dropdown();
                break;
            case "import_taxonomy":
                show_modal_import_taxonomy(node.data.key, node.data.title)
                $('.dropdown-toggle').dropdown();
                break;
            case "export_taxonomy":
                show_modal_export_taxonomy(node.data.key, node.data.title)
                $('.dropdown-toggle').dropdown();
                break;
            default:
            // alert("Todo: appply action '" + action + "' to node " + node);
        }
    });
}