import { Reminder, ReminderGroup } from './reminderLogic.js';
import { format, isToday, isPast } from 'date-fns';

export function showGroupModal() {
    const modal = document.querySelector('.modal-overlay');
    modal.classList.remove('hidden')
}

export function hideGroupModal() {
    const modal = document.querySelector('.modal-overlay');
    modal.classList.add('hidden')
}

export function displayGroups(groups, selectedGroup, onGroupClick, onGroupDelete) {
    const groupContainer = document.querySelector('.group-section-content');
    groupContainer.innerHTML = '';
    for (let i = 0; i < groups.length; i++) {
        const card = document.createElement('div');
        card.classList.add('group');
        
        const groupName = document.createElement('span');
        groupName.textContent = groups[i].Name;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.classList.add('group-delete-btn');
        deleteBtn.addEventListener('click', (event) => {
            event.stopPropagation(); 
            onGroupDelete(groups[i]);  
        });

        card.appendChild(groupName);
        card.appendChild(deleteBtn);


        if (groups[i] === selectedGroup) {
            card.classList.add('group-selected');
        }
        card.addEventListener('click', () => {
            onGroupClick(groups[i]);  // Call the function script.js gave us
        });
        groupContainer.append(card);
    } 
}

export function displayReminders(group, onSave) {
    const remContainer = document.querySelector('.reminder-section-content');
    remContainer.innerHTML = '';
    
    for (let i = 0; i < group.rems.length; i++) {  // Note: group.rems not group.length
        const reminder = group.rems[i];
        
        // Create all elements
        const card = document.createElement('div');
        card.classList.add('reminder-card');
        
        const header = document.createElement('div');
        header.classList.add('reminder-header');
        
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('reminder-left');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('reminder-checkbox');

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                card.classList.add('reminder-card-clearing');
                setTimeout(() => {
                    group.removeItem(reminder.title);
                    displayReminders(group);
                    onSave();
                }, 2000);
            }
        });
        
        const title = document.createElement('h3');
        title.classList.add('reminder-title');
        title.textContent = reminder.title;
        
        const priority = document.createElement('span');
        priority.classList.add('reminder-priority', reminder.priority);
        priority.textContent = reminder.priority;
        
        const description = document.createElement('p');
        description.classList.add('reminder-description');
        description.textContent = reminder.description;
        
        const footer = document.createElement('div');
        footer.classList.add('reminder-footer');
        
        const dueDate = document.createElement('span');
        dueDate.classList.add('reminder-due-date');
        if (reminder.dueDate) { 
            const formattedDate = format(new Date(reminder.dueDate), 'MMM dd, yyyy');
            dueDate.textContent = `Due: ${formattedDate}`;
        } else {
            dueDate.textContent = 'No due date';  // Or just leave it empty
        }
        
        const expandBtn = document.createElement('button');
        expandBtn.classList.add('reminder-expand-btn');
        expandBtn.textContent = '...';
        const notes = document.createElement('div');
        notes.classList.add('reminder-notes', 'hidden');
        const notesP = document.createElement('p');
        notesP.textContent = reminder.notes;
        notes.appendChild(notesP);

        expandBtn.addEventListener('click', () => {
            notes.classList.toggle('hidden');
        });
        


        leftDiv.appendChild(checkbox);
        leftDiv.appendChild(title);
        
        header.appendChild(leftDiv);
        header.appendChild(priority);
        
        footer.appendChild(dueDate);
        footer.appendChild(expandBtn);
        
        card.appendChild(header);
        card.appendChild(description);
        card.appendChild(footer);
        card.appendChild(notes);
        
        remContainer.appendChild(card);
    }
}