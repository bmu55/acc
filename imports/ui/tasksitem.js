import { Template } from 'meteor/templating';

import { TdList } from '../api/tasks.js';

import './tasks_item.html';

Template.task.helpers({
    toLstr(date){return date.toLocaleString()}
});
Template.task.events({
    'click .toggle-checked'() {
        console.log(this)
        // Set the checked property to the opposite of its current value
        TdList.update(this._id, {
            $set: { checked: ! this.checked },
        });
    },
    'click .delete'() {
        TdList.remove(this._id);
    },
});