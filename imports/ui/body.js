import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
// import { Mongo } from 'meteor/mongo';
//
// import { UserList } from '../api/tasks.js';

import './body.html';

Template.body.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
});

Template.body.helpers({
    clearSt(){
        if(!Meteor.userId()) console.log("logout");
        const stored = Template.instance();
        stored.state.set('arrUsers','');
    },
    userList() {

        let cUserId = Meteor.userId();
        let objUser, allData;
        if (localStorage.getItem("myDB")) {
            allData = JSON.parse(localStorage.getItem("myDB"));
            objUser = allData.filter(function (el) {
                return el.userId === cUserId
            })[0]
        } else {
            allData = []
        }
        if (!objUser){
            objUser = {userId:cUserId,arSubs:[]}
        }
        const stored = Template.instance();
        let arr = stored.state.get('arrUsers');
        if (!arr) arr = objUser.arSubs;
        let arUsers = [];
        let obj;
        let bdUsers = Meteor.users.find({});
        bdUsers.forEach((user) => {
            let a = arr.filter(function (el) {
                return el.username === user.username
            })[0];
            if (a){
                a.curId = !(cUserId === user._id) ;
            } else {
                obj={};
                obj.username = user.username;
                obj.curId = !(cUserId === user._id) ;
                a = obj;
            }
            let fla = true;
            for (let i = 0; i < arUsers.length; i++){
                if (arUsers[i] === a.username) {
                    fla = false;
                    arUsers[i] = a;
                    break
                }
            }
            if (fla) arUsers.push(a)
        });
        objUser = {userId:cUserId,arSubs:arUsers};
        let fl = true;
        for (let i=0; i < allData.length; i++){
            if (allData[i].userId === objUser.userId ){
                fl = false;
                allData[i] = objUser;
                break
            }
        }
        if (fl) allData.push(objUser);
        localStorage.setItem("myDB",JSON.stringify(allData));
        stored.state.set('arrUsers',arUsers);
        return stored.state.get('arrUsers')
    },
});

Template.body.events({
     'click .subs'() {
        let name = this.username;
        let stored = Template.instance();
        let arr = stored.state.get('arrUsers');
        arr.map(function (el) {
            if (el.username === name) {
                el.subs = !el.subs
            }
        });
        stored.state.set('arrUsers',arr)
    },
});


