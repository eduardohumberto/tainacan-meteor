import './itemActions.html';

Template.itemActions.onCreated(function () {
   var slug = FlowRouter.getParam('slug');
   var item = this.data.slug;
   this.urlEditItem = function(){
      return '/'+slug+'/editar-item/'+item
   }
});

Template.itemActions.helpers({
    getUrlEditItem:function(){
        return Template.instance().urlEditItem();
    },
})
