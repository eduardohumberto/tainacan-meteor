import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { FilesCollection} from  'meteor/ostrio:files';
import { check } from 'meteor/check';


export const Item = new Mongo.Collection('item');
this.itemImages = new FilesCollection({
  collectionName: 'itemImages',
  debug: true, // <— Mandatory
 // storagePath: '/data/uploads',
 // downloadRoute: '/files/item',
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
