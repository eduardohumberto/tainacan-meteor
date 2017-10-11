import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Collections} from '../../../../api/collections/collections.js';
import { Item } from '../../../../api/item/item.js';

import './modeCards.html';


Template.modeCards.onCreated(function () {
    var self = this;
    self.autorun(function () {
       // self.subscribe('item.getItem', self.data.slug);
        self.subscribe('item.getThumbnail', self.data._id);
    });
    this.getItem = function(){
         return this.data;
     };
    this.currentUpload = new ReactiveVar(false);
});

Template.modeCards.helpers({
    getThumbnail: function () {
        var item = Template.instance().getItem();
        var back;
        if (item.thumbnail) {
            itemImages.find({_id: item.thumbnail}).forEach(function (row) {
                back = row;
            });
            return back;
        }
    },
    hasThumbnail: function () {
        var item = Template.instance().getItem();
        if (item.thumbnail) {
            return true;
        } else {
            return false;
        }
    },
    getActualPath: function () {
        return FlowRouter.current().path;
    },
    currentUpload: function () {
        return Template.instance().currentUpload.get();
    },
    getOwner: function () {
        return Meteor.users.findOne().emails[0].address;
    },
    getDate: function (data) {
        return data.getDate() + "/" + (data.getMonth() + 1) + "/" + data.getFullYear();
    },
    getTitleFirstLetter: function (title) {
        return title[0].toUpperCase();
    },
    getURLItem: function (slug) {
        var collection = Collections.findOne();
        return collection.slug + '/item/' + slug;
    }
});