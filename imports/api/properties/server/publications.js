import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { Properties} from '../properties.js';
import { Categories } from '../../categories/categories.js';

Meteor.publish('properties.user-properties', function() {
  return Properties.find({
    owner: this.userId });
});
//busca a propriedade pelo id
Meteor.publish('properties.get-property-by-id', function(id) {
  check(slug,String);
  var property = Properties.find({_id: id});
  var owner = Meteor.users.find({_id:  { $in:[property.owner] }});
  return [property,owner];
});

//busca a propriedade pelo slug
Meteor.publish('properties.single-property-slug', function(slug) {
  check(slug,String);
  var property = Properties.find({slug: slug});
  var owner = Meteor.users.find({_id:  { $in:[property.owner] }});
  return [property,owner];
});


  Meteor.publish('properties.get-properties', function(array) {
     if(array && array.length>0){
        return Properties.find({_id:  { $in:array }});
     }else{
        return [];
     }
  });

Meteor.publish('properties.get-properties-form', function(repositoryArray,collectionArray) {
    var array =  [];
    array = _.union(collectionArray,repositoryArray);
    array = findCategoriesProperties(array,Properties,array);
    
    console.log('published',array);
     if(array && array.length>0){
        return Properties.find({_id:  { $in:array }});
     }else{
        return [];
     }
  });

Meteor.publish('files.images.all', function () {
    return collectionImages.collection.find({});
  });


/****/
function findCategoriesProperties(array,classProperties,Allproperties) {
    if(array){
       arrayProperties = classProperties.find({_id:  { $in:array }}).fetch();
       if(arrayProperties && arrayProperties.length > 0){
          _.each(arrayProperties, function(property){
              if(property.type == 'category'){
                  var result = getChildren(property.taxonomyId)
                  if(result && result.length > 0){
                      _.each(result, function(categoryChild){
                          Allproperties = _.union(Allproperties,categoryChild.properties);
                          console.log('why',Allproperties);
                          Allproperties = findCategoriesProperties(categoryChild.properties,classProperties,Allproperties);
                      });
                  }
              }
          }) 
       }
    }
    return Allproperties;
  }

  function getChildren(id){
    if(Categories.find({parent:id}).count() > 0){
          children = Categories.find({parent: id}).fetch();
          return children;
    }else{
       return false;
    }
  }