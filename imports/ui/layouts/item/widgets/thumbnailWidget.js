import { FilesCollection } from 'meteor/ostrio:files';
import { Item } from '../../../../api/item/item.js';

import './thumbnailWidget.html';

Template.thumbnailWidget.onCreated(function () {
    var self = this;
    self.autorun(function () {
        self.subscribe('item.getThumbnail', self.data.item._id);
        self.subscribe('item.getAttachments', self.data.item._id);
    });
    this.currentUpload = new ReactiveVar(false);
});


Template.thumbnailWidget.helpers({
    getThumbnail:function(){
        var item = Item.findOne();
        var back;
        if (item.thumbnail) {
            itemImages.find({_id: item.thumbnail}).forEach(function(row){
               back = row;
            });
            return back;
        }
    },
    hasThumbnail: function () {
         var item = Item.findOne();
        if (item.thumbnail) {
            return true;
        } else {
            return false;
        }
    },
    getActualPath:function(){
        return FlowRouter.current().path;
    },
    currentUpload: function () {
        return Template.instance().currentUpload.get();
    }
});

Template.thumbnailWidget.events({
    'change .js-save-thumbnail': function (e, template) {
        console.log(e, template);
        var item = Item.findOne();
        // We upload only one file, in case
        // multiple files were selected
        var upload = itemImages.insert({
            file: e.currentTarget.files[0],
           streams: 'dynamic',
            chunkSize: 'dynamic'
        }, false);
        upload.on('start', function () {
            template.currentUpload.set(this);
       });

        upload.on('end', function (error, fileObj) {
            if (error) {
                alert('Error during upload: ' + error);
            } else {
                Meteor.call('item.updateField',item._id,{thumbnail: fileObj._id});
                console.log('item.getThumbnail', item);
                template.subscribe('item.getThumbnail', item._id);
            }
            template.currentUpload.set(false);
        });
        upload.start();
    }
});



