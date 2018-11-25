import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { MyData } from '../api/data.js';
import { UsersList } from '../api/data.js';

import './body.html';

Template.body.helpers({
    showUsers(){ //if users logout: render list all users with counts
        if(!Meteor.userId()) {
            let list =  UsersList.find({},{sort: { username: 1 }});
            let ret = [];
            list.forEach((user) =>{
                let counts;
                let objUser = MyData.findOne({userId:user._id});
                if (objUser) {
                    counts = objUser.arSubs.filter((el) => el.subs).length;
                } else {
                    counts = 0
                }
                ret.push({username:user.username,counts:counts})
            });
            return ret
        } else {
            return []
        }
    },
    userList() { // return the updated subscription array
        let cUserId = Meteor.userId();
        // get saved subscription array from current user
        let objUser = MyData.findOne({userId:cUserId});
        if (!objUser){
            objUser = {userId:cUserId,arSubs:[]};
            MyData.insert(objUser);
        }
        let bdUsers = UsersList.find({_id:{$ne:cUserId}},{sort: { username: 1 }});
        let arUsers = [];
        bdUsers.forEach((user) => { // fill array of subscriptions
            let a = objUser.arSubs.filter((el) => el.username === user.username)[0];
            if (!a) a = {username:user.username, subs:false};
            arUsers.push(a)
        });
        //move subscriptions to the beginning of the array
        arUsers = arUsers.filter((el) => el.subs).concat(arUsers.filter((el) => !el.subs));
        // save array in my data
        MyData.update(objUser._id,{userId:cUserId,arSubs:arUsers});

        // failed write to profile :-(
        UsersList.update(objUser._id,{$set:{profile:{name:"www",arSubs:arUsers}}});

        return arUsers
    },
});

Template.body.events({
     'click .subs'() {
         // let elDom = document.getElementById(this.username);
         // elDom.classList.add('move'); // animation for change
         $('li').addClass('move');
         let name = this.username;
         let cUserId = Meteor.userId();
         let objUser = MyData.findOne({userId:cUserId});
         let arr = objUser.arSubs;
        arr.map(function (el) { // change subscription
            if (el.username === name) {
                el.subs = !el.subs
            }
        });
        setTimeout(function () { // save change (after animation)
            MyData.update(objUser._id,{userId:cUserId,arSubs:arr});
            //elDom.classList.remove('move');
            $('li').removeClass('move')
        },600)
    }
});

// Template.userItem.helpers ({
//     showUs: function(name){ // don't show current user
//         return name !== Meteor.user().username;
//     }
// });
Template.count.helpers ({
   counts: function () {
       let objUser = MyData.findOne({userId:Meteor.userId()});
       let arr = [];
       if (objUser) {
           arr = objUser.arSubs.filter((el) => el.subs);
       }
       return arr.length
   }
});
