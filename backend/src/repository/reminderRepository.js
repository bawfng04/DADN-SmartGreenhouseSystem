const reminderModel = require('../models/reminderModel');

class ReminderRepository{
    async getAllReminders() {
        return reminderModel.getAllReminders();
    }
    async getReminderById(id) {
        return reminderModel.getReminderById(id);
    }
    async createReminder(data) {
        return reminderModel.createReminder(data);
    }
    async updateReminderStatus(id, status) {
        return reminderModel.updateReminderStatus(id, status);
    }
    async deleteReminder(id) {
        return reminderModel.deleteReminder(id);
    }

}

module.exports = new ReminderRepository();