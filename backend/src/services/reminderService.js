const reminderRepository = require('../repository/reminderRepository');

class ReminderService{
    async fetchAllReminders() {
        const reminders = await reminderRepository.getAllReminders();
        // trả về danh sách reminder
        return reminders.map(r => ({
            id: String(r.id),
            index: r.index_name,
            higherThan: r.higher_than_status ? r.higher_than_value : null,
            lowerThan: r.lower_than_status ? r.lower_than_value : null,
            repeatAfter: r.repeat_after_status ? r.repeat_after_value : null,
            active: r.active,
        })).filter(r => r!== null);
    }

    async addReminder(data, userId) {
        const newReminder = await reminderRepository.createReminder(data, userId);
        //data đã bao gồm lowerThan, higherThan, repeatAfter...
        return {
            id: String(newReminder.id),
            userId: newReminder.user_id,
            index: newReminder.index_name,
            higherThan: newReminder.higher_than_status ? newReminder.higher_than_value : null,
            lowerThan: newReminder.lower_than_status ? newReminder.lower_than_value : null,
            repeatAfter: newReminder.repeat_after_status ? newReminder.repeat_after_value : null,
            active: newReminder.active,
        };
    }

    async removeReminder(id) {
        const selectedReminder = await reminderRepository.deleteReminder(id);
        if (!selectedReminder) {
            throw new Error("Reminder not found");
        }
        return true;
    }

    async fetchReminderById(id) {
        const selectedReminder = await reminderRepository.getReminderById(id);
        if (!selectedReminder) {
            throw new Error("Reminder not found");
        }
        return {
            id: String(selectedReminder.id),
            index: selectedReminder.index_name,
            higherThan: selectedReminder.higher_than_status ? selectedReminder.higher_than_value : null,
            lowerThan: selectedReminder.lower_than_status ? selectedReminder.lower_than_value : null,
            repeatAfter: selectedReminder.repeat_after_status ? selectedReminder.repeat_after_value : null,
            active: selectedReminder.active,
        };
    }

    async toggleReminderStatus(id) {
        const selectedReminder = await reminderRepository.getReminderById(id);
        if (!selectedReminder) {
            throw new Error("Reminder not found");
        }
        const newStatus = !selectedReminder.active;
        const updatedReminder = await reminderRepository.updateReminderStatus(id, newStatus);
        if(!updatedReminder) {
            throw new Error("Failed to update reminder status");
        }
        return {
            id: String(updatedReminder.id),
            index: updatedReminder.index_name,
            higherThan: updatedReminder.higher_than_status ? updatedReminder.higher_than_value : null,
            lowerThan: updatedReminder.lower_than_status ? updatedReminder.lower_than_value : null,
            repeatAfter: updatedReminder.repeat_after_status ? updatedReminder.repeat_after_value : null,
            active: updatedReminder.active,
        };
    }

}

module.exports = new ReminderService();