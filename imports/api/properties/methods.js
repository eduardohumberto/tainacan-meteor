import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Properties } from './properties.js';

Meteor.methods({
  'properties.insertData':function(property){
      check(property.name, String);
      // Make sure the user is logged in before inserting a task
       if (! this.userId) {
         throw new Meteor.Error('not-authorized');
       }
      //gerando o slug
      var slug = property.name.toLowerCase()
                      .replace(/[^\w ]+/g,'')
                      .replace(/ +/g,'-');
      var data = Properties.findOne({"slug": slug});
      if (data) {
        var cont = 1;
        slug = slug  +'_'+ cont.toString();
        var data = Properties.findOne({"slug": slug});;
        while(data){
            cont++;
            slug = slug +'_'+cont.toString();
            var data = Properties.findOne({"slug": slug});
        }
      }
      //se for metaado de categoria
      if(property.createdCategory){
          var property_id = Properties.insert({
           name:property.name,
           createdAt: new Date(),
           createdCategory: property.createdCategory,
           owner: this.userId,
           slug:slug,
           type:property.type
         });
      }else{
          var property_id = Properties.insert({
           name:property.name,
           createdAt: new Date(),
           owner: this.userId,
           slug:slug,
           type:property.type,
           tab:property.tab
         });
      }
      //inserindo de fato no banco 
      return property_id;
   },
   'properties.insertTerm':function(property){
      check(property.name, String);
      // Make sure the user is logged in before inserting a task
       if (! this.userId) {
         throw new Meteor.Error('not-authorized');
       }
      //gerando o slug
      var slug = property.name.toLowerCase()
                      .replace(/[^\w ]+/g,'')
                      .replace(/ +/g,'-');
      var data = Properties.findOne({"slug": slug});
      if (data) {
        var cont = 1;
        slug = slug  +'_'+ cont.toString();
        var data = Properties.findOne({"slug": slug});;
        while(data){
            cont++;
            slug = slug +'_'+cont.toString();
            var data = Properties.findOne({"slug": slug});
        }
      }
      //se for metaado de categoria
      if(property.createdCategory){
          var property_id = Properties.insert({
           name:property.name,
           createdAt: new Date(),
           taxonomyId:property.taxonomyId,
           createdCategory: property.createdCategory,
           owner: this.userId,
           slug:slug,
           type:'category'
         });
      }else{
          var property_id = Properties.insert({
           name:property.name,
           taxonomyId:property.taxonomyId,
           createdAt: new Date(),
           owner: this.userId,
           slug:slug,
           type:'category',
           tab:property.tab
         });
      }
      //inserindo de fato no banco 
      return property_id;
   },
   'properties.insertObject':function(property){
      check(property.name, String);
      // Make sure the user is logged in before inserting a task
       if (! this.userId) {
         throw new Meteor.Error('not-authorized');
       }
      //gerando o slug
      var slug = property.name.toLowerCase()
                      .replace(/[^\w ]+/g,'')
                      .replace(/ +/g,'-');
      var data = Properties.findOne({"slug": slug});
      if (data) {
        var cont = 1;
        slug = slug  +'_'+ cont.toString();
        var data = Properties.findOne({"slug": slug});;
        while(data){
            cont++;
            slug = slug +'_'+cont.toString();
            var data = Properties.findOne({"slug": slug});
        }
      }
      //se for metaado de object
      if(property.createdCategory){
          var property_id = Properties.insert({
           name:property.name,
           createdAt: new Date(),
           categories:property.categories,
           createdCategory: property.createdCategory,
           owner: this.userId,
           slug:slug,
           type:'object'
         });
      }else{
          var property_id = Properties.insert({
           name:property.name,
           categories:property.categories,
           createdAt: new Date(),
           owner: this.userId,
           slug:slug,
           type:'object',
           tab:property.tab
         });
      }
      //inserindo de fato no banco 
      return property_id;
   },
   /***** UPDATES *****/
   'properties.updateField':function(id,value){
      Properties.update(id,{$set:value});
    },
   'properties.remove':function(id) {
      const collection = Properties.findOne(id);
      if (collection.owner !== this.userId) {
        // If the task is private, make sure only the owner can delete it
        throw new Meteor.Error('not-authorized');
      }
      Properties.remove(id);
   }
});
