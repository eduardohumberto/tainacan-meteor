import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Categories } from './categories.js';

Meteor.methods({
  'categories.insert':function(category){
      check(category.name, String);
      // Make sure the user is logged in before inserting a task
       if (! this.userId) {
         throw new Meteor.Error('not-authorized');
       }

       var slug = category.name.toLowerCase()
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
      var category_id = Categories.insert({
         name:category.name,
         parent:category.parent,
         description:category.description,
         permission:category.permission,
         createdAt: new Date(),
         owner: this.userId,
         slug:slug,
         properties:[]
       });
       return category_id;
   },
   /***** UPDATES *****/
   'categories.updateField':function(id,value){
      Categories.update(id,{$set:value});
      return true;
    },
   'categories.remove':function(id) {
      const category = Categories.findOne(id);
      if (category.owner !== this.userId) {
        // If the task is private, make sure only the owner can delete it
        throw new Meteor.Error('not-authorized');
      }else{
         if(Categories.find({parent:id}).count() > 0){
            children = Categories.find({parent: id}).fetch();
            for (var i = 0; i < children.length; i++) {
                 Categories.update(children._id,{$set:{parent:category.parent}});
            }
         }
      }
      Categories.remove(id);
      return true;
   },

   'categories.add-property':function(category_id,id){
      const category = Categories.findOne(category_id);
      if(category.properties && category.properties.indexOf(id)<0){
        Categories.update(
           { _id: category_id},
           { $push: { properties: id }}
          );
      }
   },
   'categories.remove-property':function(collection_id,id){
     const category = Categories.findOne(category_id);
     if(category.properties && category.properties.indexOf(id)>=0){
       Categories.update(
          { _id: category_id},
          { $pull: { properties: id }}
         );
     }
   },
   'categories.get-children':function(id){
    console.log(Categories.find({parent:id}).count())
      if(Categories.find({parent:id}).count() > 0){
            children = Categories.find({parent: id}).fetch();
            return children;
      }else{
         return false;
      }
   }
});
