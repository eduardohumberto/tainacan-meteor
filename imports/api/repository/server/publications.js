import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Repository } from '../repository.js';


//busca a colecao
Meteor.publish('getRepository', function() {
  var repository = Repository.find({slug:'tainacan-repository'});
  return repository;
});

Meteor.publish('getCoverRepository', function (slug) {
   var repository = Repository.findOne({slug:'tainacan-repository'});
   if(repository.cover){
       return repositoryImages.collection.find({_id: repository.cover});
   }else{
     return this.ready();
   }
  });