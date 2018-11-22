import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { MyData } from '../api/data.js';
import { UsersList } from '../api/data.js';

import './body.html';

Template.body.helpers({
    showUsers(){
        if(!Meteor.userId()) {
            return UsersList.find({},{sort: { username: 1 }})
        } else {
            return []
        }
    },
    userList() {

        let cUserId = Meteor.userId();
        let objUser = MyData.findOne({userId:cUserId});
        if (!objUser){
            objUser = {userId:cUserId,arSubs:[]};
            MyData.insert(objUser);
            objUser = MyData.findOne({userId:cUserId});
        }
        let arr = objUser.arSubs;
        let arUsers = [];
        let bdUsers = UsersList.find({},{sort: { username: 1 }});
        bdUsers.forEach((user) => {
            let a = arr.filter(function (el) {
                return el.username === user.username
            })[0];
            if (!a) a = {username : user.username};
            let fl = true;
            for (let i = 0; i < arUsers.length; i++){
                if (arUsers[i] === a.username) {
                    fl = false;
                    arUsers[i] = a;
                    break
                }
            }
            if (fl) arUsers.push(a)
        });
        // UsersList.update(objUser._id,{$set:{profile:{name:"www"}}});
        // console.log(UsersList.find({_id:Meteor.userId()}));
        let temp1 = arUsers.filter(function (el) {return el.subs});
        let temp2 = arUsers.filter(function (el) {return !el.subs});
        arUsers = temp1.concat(temp2);
        //console.log(arUsers);
        MyData.update(objUser._id,{userId:cUserId,arSubs:arUsers});
        return arUsers
    },
});

Template.body.events({
     'click .subs'() {
         let name = this.username;
         let cUserId = Meteor.userId();
         let objUser = MyData.findOne({userId:cUserId});
         let arr = objUser.arSubs;
        arr.map(function (el) {
            if (el.username === name) {
                el.subs = !el.subs
            }
        });
         MyData.update(objUser._id,{userId:cUserId,arSubs:arr});
    },
});

Template.userItem.helpers ({
    showUs: function(name){
        return name !== Meteor.user().username;
    }
});
