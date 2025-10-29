export class ReminderGroup {
    constructor(Name) {
        this.Name = Name
        this.rems = []
    }

    addItem (reminderItem) {
        this.rems.push(reminderItem)
    }

    removeItem(titleToRemove) {
        const index = this.rems.findIndex(reminder => reminder.title === titleToRemove);
        if (index !== -1) {
            this.rems.splice(index, 1);
        }
    }
}

export class Reminder {
    constructor(title, description, dueDate, priority, notes) {
        this.title = title
        this.description = description
        this.dueDate = dueDate
        this.priority = priority
        this.notes = notes
    }
}