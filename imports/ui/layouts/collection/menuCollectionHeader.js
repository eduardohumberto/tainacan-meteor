import './menuCollectionHeader.html';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.menuCollectionHeader.helpers({
    linkProperty: function () {
        var id = FlowRouter.getParam('slug');
        return id + '/administracao/metadados';
    }
  });
