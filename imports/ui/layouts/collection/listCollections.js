import './singleListCollection.js';
import './listCollections.html';
import { Collections} from '../../../api/collections/collections.js';


Template.listCollections.onCreated(function () {
    var self = this;
    self.autorun(function () {
        self.subscribe('listCollections');
    });
    this.getRandomImage = new ReactiveVar(Math.floor((Math.random() * 5) + 1));

});

Template.listCollections.helpers({
    collections: function () {
        return Collections.find({});
    },
    hasCollection: function () {
        var cursor = Collections.find({});
        if (cursor) {
            return true
        } else {
            return false;
        }
    },
    getRandomImage: function () {
        return Template.instance().getRandomImage.get();
    }
});