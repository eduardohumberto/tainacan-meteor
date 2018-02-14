import '/imports/startup/client';
import '/imports/startup/both';

 TAPi18n.setLanguage('br');

// helpers
Template.registerHelper('generateJson',function(categoryUser,collectionCategories,categoriesCollection,hideCheckbox){
    var roots = [];
    if(!hideCheckbox){
    	hideCheckbox = true;
    }
    roots.push(recursiveMountJson(categoryUser,categoriesCollection));
    roots.push(recursiveMountJson(collectionCategories,categoriesCollection));
    return roots;
})

function recursiveMountJson(category,categoriesCollection,hideCheckbox) {
    var obj = {}
    if (category && category._id) {
        obj['title'] = category.name;
        obj['key'] = category._id;
        obj['expand'] = true;
        obj['hideCheckbox'] = hideCheckbox;
        obj['children'] = generalMountJson(category,categoriesCollection);
    }
    return obj;
}

function generalMountJson(category,categoriesCollection){
    var obj = {}
    obj['children'] = [];
    if (categoriesCollection && categoriesCollection.find({parent: category._id}).count() > 0) {
        var children = categoriesCollection.find({parent: category._id}, {sort: {createdAt: -1}}).fetch();
        for (var i = 0; i < children.length; i++) {
            obj['children'].push(recursiveMountJson(children[i],categoriesCollection))
        }
    }
    return obj['children'];
}
