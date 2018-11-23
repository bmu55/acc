import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { MyData } from '../api/data.js';
import { UsersList } from '../api/data.js';

import './body.html';

Template.body.helpers({
    showUsers(){
        if(!Meteor.userId()) {
            let list =  UsersList.find({},{sort: { username: 1 }});
            let ret = [];
            list.forEach((user) =>{
                let objUser = MyData.findOne({userId:user._id});
                let counts = objUser.arSubs.filter(function (el) {
                    return el.subs
                }).length;
                ret.push({username:user.username,counts:counts})
            });
            return ret
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
        }
        //let arr = objUser.arSubs;
        let arUsers = [];
        let bdUsers = UsersList.find({},{sort: { username: 1 }});
        bdUsers.forEach((user) => {
            let a = objUser.arSubs.filter(function (el) {
                return el.username === user.username
            })[0];
            if (!a) a = {username : user.username};
            arUsers.push(a)
        });
        // UsersList.update(objUser._id,{$set:{profile:{name:"www"}}});
        // console.log(UsersList.find({_id:Meteor.userId()}));
        let temp1 = arUsers.filter(function (el) {return el.subs});
        let temp2 = arUsers.filter(function (el) {return !el.subs});
        arUsers = temp1.concat(temp2);
        // console.log(arUsers);
        MyData.update(objUser._id,{userId:cUserId,arSubs:arUsers});
        return arUsers
    },
});

Template.body.events({
     'click .subs'() {
         let elDom = document.getElementById(this.username);
         elDom.classList.add('move');
         let name = this.username;
         let cUserId = Meteor.userId();
         let objUser = MyData.findOne({userId:cUserId});
         let arr = objUser.arSubs;
        arr.map(function (el) {
            if (el.username === name) {
                el.subs = !el.subs
            }
        });
        setTimeout(function () {
            MyData.update(objUser._id,{userId:cUserId,arSubs:arr});
            elDom.classList.remove('move');
        },600)
    }
});

Template.userItem.helpers ({
    showUs: function(name){
        return name !== Meteor.user().username;
    }
});
Template.count.helpers ({
   counts: function () {
       let objUser = MyData.findOne({userId:Meteor.userId()});
       let arr = objUser.arSubs.filter(function (el) {
           return el.subs
       });
       return arr.length
   }
});
