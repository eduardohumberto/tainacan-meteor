import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Categories} from '../categories.js';

Meteor.publish('categories.user-categories', function(id) {
  return Categories.find({
    owner: id });
});
//busca a propriedade pelo id
Meteor.publish('categories.get-category-by-id', function(id) {
  check(slug,String);
  var property = Categories.find({_id: id});
  var owner = Meteor.users.find({_id:  { $in:[property.owner] }});
  return [property,owner];
});

//busca a propriedade pelo slug
Meteor.publish('categories.single-category-slug', function(slug) {
  check(slug,String);
  var category = Categories.find({slug: slug});
  var owner = Meteor.users.find({_id:  { $in:[category.owner] }});
  return [category,owner];
});

//busca ascategoriasraizes do repositorio
Meteor.publish('categories.getRootCategories', function() {
  return Categories.find({slug:  { $in:['tainacan-taxonomy','tainacan-category'] }});
});

Meteor.publish('categories.get-categories', function(array) {
     if(array && array.length>0){
        return Categories.find({_id:  { $in:array }});
     }else{
        return [];
     }
  });
