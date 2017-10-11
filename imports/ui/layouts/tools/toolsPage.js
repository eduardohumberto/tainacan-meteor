import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Repository} from '../../../api/repository/repository.js';
import { Collections} from '../../../api/collections/collections.js';
import { Properties} from '../../../api/properties/properties.js';
import { Categories} from '../../../api/categories/categories.js';
import { displayError } from '../../lib/errors.js';

import './toolsPage.html';

Template.toolsPage.onCreated(function () {
    var self = this;
    self.autorun(function () {
    });
});

Template.toolsPage.onRendered(function () {
    $('.dropdown-toggle').dropdown();
});


Template.toolsPage.helpers({
});

Template.toolsPage.events({
        'click #clearAll': function (event, instance) {
            $('.form-tools').hide();
            $('.loader').show();
             Meteor.call('tools.clearAll','',function (error, result) {
                $('.form-tools').show();
                $('.loader').hide();
                if (error) {
                    displayError(error);
                } else if (result) {
                    Bert.alert({title: TAPi18n.__('success'),
                        message: TAPi18n.__('Tools.created-success'),
                        type: 'success',
                        style: 'growl-top-right',
                        icon: 'fa-check-square'});
                }
                $('.dropdown-toggle').dropdown();
            });
            return true;
        },
	'submit #submit_tools': function (event, instance) {
        event.preventDefault();
        var tools = {
            collections: $('#collections').val().trim(),
            metadataText: $('#metadataText').val().trim(),
            items: $('#items').val(),
        };
        // insere ou atualiza
        if (tools.collections != '') {
            $('.form-tools').hide();
            $('.loader').show();
            Meteor.call('tools.populate', tools, function (error, result) {
                $('.form-tools').show();
                $('.loader').hide();
                if (error) {
                    displayError(error);
                } else if (result) {
                    Bert.alert({title: TAPi18n.__('success'),
                        message: TAPi18n.__('Tools.created-success'),
                        type: 'success',
                        style: 'growl-top-right',
                        icon: 'fa-check-square'});
                }
                $('.dropdown-toggle').dropdown();
            });
        } else {
            var error = {error: TAPi18n.__('formCategory.empty-name')};
            displayError(error);
        }
    }
});
