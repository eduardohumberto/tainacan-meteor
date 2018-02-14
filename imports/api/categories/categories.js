import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { FilesCollection} from  'meteor/ostrio:files';
import { check } from 'meteor/check';

class CategoriesCollection extends Mongo.Collection {
  insert(doc, callback) {
    const ourDoc = doc;
    ourDoc.createdAt = ourDoc.createdAt || new Date();
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



export const Categories = new CategoriesCollection('categories');


// Deny all client-side updates since we will be using methods to manage this collection
Categories.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});


if (Meteor.isServer && Categories.find({slug:'tainacan-category'}).count() === 0) {
        Categories.insert({
            name: TAPi18n.__('Tainacan Category'),
            createdAt: new Date(),
            slug: 'tainacan-category'
        });

        Categories.insert({
            name: TAPi18n.__('Tainacan Taxonomy'),
            createdAt: new Date(),
            slug: 'tainacan-taxonomy'
        });
}