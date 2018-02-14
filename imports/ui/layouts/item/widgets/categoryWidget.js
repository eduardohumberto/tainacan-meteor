import './categoryWidget.html';
import '../inputs/selectboxInput.js';

Template.categoryWidget.onCreated(function () {
     this.cardinality = new ReactiveVar(1);
     this.getItem = function(){
         return this.data.item;
     };
     this.getProperty = function(){
         return this.data.property;
     }
     this.showValue = function(){
         return (this.data.showValue) ? this.data.showValue : false;
     }
});


Template.categoryWidget.helpers({
    cardinality() {
        let cardinalityArray = [];
        const cardinality = Template.instance().cardinality.get();
        for (var index = 0; index < cardinality; index++) {
            cardinalityArray.push({
                index: index
            });
        }
        return cardinalityArray;
    },
    isMultipleValue(){
        var cardinality = Template.instance().data.property.cardinality;
        if(cardinality && cardinality == 'n'){
             return true;
        }else{
            return false;
        }
    },
    getArgs(index){
      return {
        item : Template.instance().data.item,
        property:Template.instance().data.property,
        showValue: Template.instance().showValue(),
        index:index
      }
    },
    isInput(type){
        if(Template.instance().data.property.typeInput && type == Template.instance().data.property.typeInput){
            return true;
        }else{
           if(type == 'selectbox'){
                return true;
           }else{
             return false;
           }
        }
    }
});

Template.categoryWidget.events({
  'click .add-field': function( event, template ) {
     var now = template.cardinality.get();
     template.cardinality.set( now++ );
  }
});
