import './menuCollectionHeader.js';
import './collectionHeader.html';
import { FilesCollection } from 'meteor/ostrio:files';
import { Collections} from '../../../api/collections/collections.js';


Template.collectionHeader.onCreated(function () {
    var self = this;
    self.autorun(function () {
        var slug = FlowRouter.getParam('slug');
        self.subscribe('singleCollection', slug);
        self.subscribe('getThumbnail', slug);
        self.subscribe('getCover', slug);
    });
    this.currentUpload = new ReactiveVar(false);
});


Template.collectionHeader.helpers({
    collection: function () {
        var id = FlowRouter.getParam('slug');
        return Collections.findOne({slug: id});
    },
    getTitleFirstLetter:function(title){
        return (title) ? title[0].toUpperCase(): '';
    },
    getOwner:function(){
        return Meteor.users.findOne().emails[0].address;
    },
    getCover: function () {
        var id = FlowRouter.getParam('slug');
        var back;
        var collection = Collections.findOne({slug: id});
        if (collection && collection.cover) {
          collectionImages.find({_id: collection.cover}).forEach(function(row){
             back = row;
          });
          console.log(back,'objante');
          return back;
        } else {
            return '/capa-colecao.png';
        }
    },
    getThumbnail:function(){
        var id = FlowRouter.getParam('slug');
        let collection = Collections.findOne({slug: id});
        var back;
        if (collection && collection.thumbnail) {
            collectionImages.find({_id: collection.thumbnail}).forEach(function(row){
               back = row;
            });
            return back;
        }
    },
    hasThumbnail: function () {
        var id = FlowRouter.getParam('slug');
        var collection = Collections.findOne({slug: id});
        if (collection && collection.thumbnail) {
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

Template.collectionHeader.events({
    'change #input-file-thumbnail': function (e, template) {
        console.log(e, template);
        var id = FlowRouter.getParam('slug');
        var collection = Collections.findOne({slug: id});
        // We upload only one file, in case
        // multiple files were selected
        var upload = collectionImages.insert({
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
                Meteor.call('collection.updateField',collection._id,{thumbnail: fileObj._id});
                template.subscribe('getThumbnail', collection.slug);
            }
            template.currentUpload.set(false);
        });
        upload.start();
    },
    'change #input-file-cover': function (e, template) {
        console.log(e, template);
        var id = FlowRouter.getParam('slug');
        var collection = Collections.findOne({slug: id});
        // We upload only one file, in case
        // multiple files were selected
        var upload = collectionImages.insert({
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
                Meteor.call('collection.updateField',collection._id,{cover: fileObj._id});
                template.subscribe('getCover', collection.slug);
            }
            template.currentUpload.set(false);
        });
        upload.start();
    }
});
