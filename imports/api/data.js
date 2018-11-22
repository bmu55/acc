import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const MyData = new Mongo.Collection('data');
export const UsersList = Meteor.users;