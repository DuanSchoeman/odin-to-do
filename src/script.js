import { Reminder, ReminderGroup } from './reminderLogic.js';
import './style.css';
import { format, isToday, isPast } from 'date-fns';
import { showGroupModal, hideGroupModal, displayGroups, displayReminders } from './domStuff.js';

const defaultGroup = new ReminderGroup('Personal');
let allGroups = [defaultGroup];
let selectedGroup = defaultGroup; 

function saveToLocalStorage() {
    localStorage.setItem('todoGroups', JSON.stringify(allGroups));
}

function loadFromLocalStorage() {
    const savedData = localStorage.getItem('todoGroups');
    
    if (!savedData) {
        allGroups = [defaultGroup];
        return;
    }
    
    const groupsData = JSON.parse(savedData);
    allGroups = []; 
    
    for (const group of groupsData) {
        const newGroup = new ReminderGroup(group.Name);
        allGroups.push(newGroup);
        for (const reminder of group.rems) {
            const newReminder = new Reminder(reminder.title, reminder.description, reminder.dueDate, reminder.priority, reminder.notes);
            newGroup.addItem(newReminder);
        }
    }
}

loadFromLocalStorage();
selectedGroup = allGroups[0];

function handleGroupClick(group) {
    selectedGroup = group;
    displayGroups(allGroups,selectedGroup,handleGroupClick, handleGroupDelete);
    displayReminders(selectedGroup,saveToLocalStorage); 
}

function handleGroupDelete(groupToDelete) {
    const index = allGroups.indexOf(groupToDelete);
    
    if (index !== -1) {
        allGroups.splice(index, 1);
    }
    
    if (groupToDelete === selectedGroup && allGroups.length > 0) {
        selectedGroup = allGroups[0];
    }
    
    saveToLocalStorage();
    displayGroups(allGroups, selectedGroup, handleGroupClick, handleGroupDelete);
    displayReminders(selectedGroup, saveToLocalStorage);
}

document.addEventListener('DOMContentLoaded', () => {
    displayGroups(allGroups,selectedGroup,handleGroupClick, handleGroupDelete);
    displayReminders(selectedGroup,saveToLocalStorage); 
    const remBtn = document.querySelector('.add-rem-btn');
    remBtn.addEventListener('click', () => {

        const dateInput = document.getElementById('reminder-date-input');
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        showGroupModal();
    });

    const ModalCancelBtn = document.querySelector('.cancel-btn');
    ModalCancelBtn.addEventListener('click', () => {
        hideGroupModal();
    });

    const groupBtn = document.querySelector('.add-group-btn');
    groupBtn.addEventListener('click', () => {
        const groupName = prompt('Enter group name:');
        if (groupName && groupName.trim() !== '') {
            const newGroup = new ReminderGroup(groupName);
            allGroups.push(newGroup);
            displayGroups(allGroups,selectedGroup,handleGroupClick, handleGroupDelete);
            displayReminders(selectedGroup,saveToLocalStorage); 
            saveToLocalStorage();
        }
    });

    const reminderForm = document.querySelector('.reminder-form');
    reminderForm.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log('Form submitted!');
        
        const title = document.getElementById('reminder-title-input').value;
        const description = document.getElementById('reminder-description-input').value;
        const dueDate = document.getElementById('reminder-date-input').value;
        const priority = document.getElementById('reminder-priority-input').value;
        const notes = document.getElementById('reminder-notes-input').value;
    
        console.log('Title:', title);
        console.log('Selected group:', selectedGroup);
    
        if (title.trim() != '' && description.trim() != '') {
            const reminder = new Reminder(title, description, dueDate, priority, notes);
            selectedGroup.addItem(reminder);
            displayReminders(selectedGroup,saveToLocalStorage); 
            saveToLocalStorage();
            reminderForm.reset();
            hideGroupModal();
        }
    });
});