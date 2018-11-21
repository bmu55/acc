import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { MyData } from '../api/data.js';

import './body.html';


Template.body.helpers({
    clearSt(){
        if(!Meteor.userId()) console.log("logout");
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
        let bdUsers = Meteor.users.find({});
        bdUsers.forEach((user) => {
            let a = arr.filter(function (el) {
                return el.username === user.username
            })[0];
            if (a){
                a.curId = !(cUserId === user._id) ;
            } else {
                a = {
                    username : user.username,
                    curId : !(cUserId === user._id)
                };
            }
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


