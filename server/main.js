import { Meteor } from 'meteor/meteor';
import '/imports/startup/both';
import '/imports/startup/server';

Meteor.startup(() => {
  Meteor.publish(null, function() {
      return Meteor.users.find({_id: this.userId}, {fields: { emails: 1, profile: 1 } });
    });
});
