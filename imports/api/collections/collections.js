import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { FilesCollection} from  'meteor/ostrio:files';
import { check } from 'meteor/check';
import { Categories } from '../categories/categories.js';

class CollectionsCollection extends Mongo.Collection {
  insert(doc, callback) {
    const ourDoc = doc;
    const result = super.insert(ourDoc, callback);
    //incompleteCountDenormalizer.afterInsertTodo(ourDoc);
    return result;
  }
  update(selector, modifier) {
    const result = super.update(selector, modifier);
    //incompleteCountDenormalizer.afterUpdateTodo(selector, modifier);
    return result;
  }
  remove(selector) {
    const todos = this.find(selector).fetch();
    //console.log(todos);
    //if (this.userId !== todos.owner) {
      //console.log(todos);
    //}
    const result = super.remove(selector);
    //incompleteCountDenormalizer.afterRemoveTodos(todos);
    return result;
  }
}



export const Collections = new CollectionsCollection('collections');


// Deny all client-side updates since we will be using methods to manage this collection
Collections.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

this.collectionImages = new FilesCollection({
  collectionName: 'collectionImages',
  debug: true, // <— Mandatory
  storagePath: '/home/l3p/tainacan-meteor/app_Eduardo',
  //downloadRoute: '/files/collection',
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

//helpera
Collections.helpers({
  insertRootCategory(userId,collectionName,collectionId) {
    if (Meteor.isServer) {
      var slug = collectionName.toLowerCase()
                      .replace(/[^\w ]+/g,'')
                      .replace(/ +/g,'-');
      var data = Categories.findOne({"slug": slug});
      if (data) {
        var cont = 1;
        slug = slug  +'_'+ cont.toString();
        var data = Categories.findOne({"slug": slug});;
            while(data){
                cont++;
                slug = slug +'_'+cont.toString();
                var data = Categories.findOne({"slug": slug});
            }
      }
      return Categories.insert({
         name:collectionName,
         parent:Categories.findOne({slug:'tainacan-category'})._id,
         createdAt: new Date(),
         owner: userId,
         slug:slug,
         isRootOfCollection:collectionId
      });
    }
  }
});
