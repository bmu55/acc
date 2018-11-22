import { Meteor } from 'meteor/meteor';

import '../imports/api/data';

Meteor.startup(() => {
  // code to run on server at startup
});
// Meteor.publish('myUsers', function () {
//     return Meteor.users.find({}, {
//         fields: {
//             username: 1,
//             _id: 1,
//             profile:1
//         }
//     });
// });