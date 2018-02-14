import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { FilesCollection} from  'meteor/ostrio:files';
import { check } from 'meteor/check';
import {Properties} from '../properties/properties.js'


export const Repository = new Mongo.Collection('repository');
this.repositoryImages = new FilesCollection({
  collectionName: 'repositoryImages',
  debug: true, // <— Mandatory
  storagePath: 'uploads/tainacan',
  downloadRoute: '/files/respository',
  allowClientCode:  false,
  onBeforeUpload: function (file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 ) {
      return true;
    } else {
      return 'Please upload image, with size equal or less than 10MB';
    }
  }
});

 if (Meteor.isServer && Repository.find().count() === 0) {
        var property = [];

        property.push(Properties.insert({
            name: TAPi18n.__('Title'),
            createdAt: new Date(),
            owner: 0,
            slug: TAPi18n.__('title'),
            type: 'text'
        }));
        property.push(Properties.insert({
            name: TAPi18n.__('Description'),
            createdAt: new Date(),
            owner: 0,
            slug: TAPi18n.__('description'),
            type: 'textarea'
        }));
        property.push(Properties.insert({
            name: TAPi18n.__('Thumbnail'),
            createdAt: new Date(),
            owner: 0,
            slug: TAPi18n.__('thumbnail'),
            type: 'file'
        }));
        property.push(Properties.insert({
            name: TAPi18n.__('Attachments'),
            createdAt: new Date(),
            owner: 0,
            slug: TAPi18n.__('attachmentes'),
            type: 'file'
        }));
        
        if(Repository.find().count() === 0){
            Repository.insert({
                title: 'Tainacan',
                slug: 'tainacan-repository',
                createdAt: new Date(),
                properties: property
            });
        }else{
            var repository = Repository.findOne();
            Repository.update(repository._id,{$set:{properties:property}});
        }
    }

