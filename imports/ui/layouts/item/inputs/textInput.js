import './textInput.html';

Template.textInput.onCreated(function () {
    this.getItem = function(){
        return this.data.item;
    };
    this.getProperty = function(){
        return this.data.property;
    }
    this.getIndex = function(){
        return this.data.index;
    }
    this.isEdit = function(){
       var item_slug = ( FlowRouter.getParam('item') ) ? FlowRouter.getParam('item') : false;
       return item_slug;
    }
    //console.log(this.data);
});

Template.textInput.helpers({
    getValue:function(){
        var value = (Template.instance().isEdit()) ? 'Campo vazio' : '';
        var def = value;
        var property = Template.instance().data.property;
        var item = Template.instance().data.item;
        var index = Template.instance().data.index.index;
        var index_compound = (Template.instance().data.index_compound) ? Template.instance().data.index_compound : 0;
        if(item.properties){
            $.each(item.properties,function(i,property_row){
                if(property_row._id == property._id && property_row.index === index_compound){
                    value =  (property_row.values[index]!==false) ? property_row.values[index] : def;
                }
            });
        }
        return value;
    },
    isEdit:function(){
        var property = Template.instance().isEdit();

    }

})

Template.textInput.events({
  'keyup .js-save-property': function( event, template ) {
      var value = template.$('.js-save-property').val();
      Meteor.call('item.updateProperty', template.getItem()._id,template.getProperty()._id,value,0,template.getIndex().index);
  }
});
