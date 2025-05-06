const reminderService = require('../services/reminderService');

class ReminderController {
  async getAllReminders(req, res) {
        try {
            const reminders = await reminderService.fetchAllReminders();
            res.json(reminders);
        } catch (error) {
            console.error("Error fetching reminders:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getReminderById(req, res) {
        try {
            const { id } = req.params;
            const reminder = await reminderService.fetchReminderById(id);
            if (!reminder) {
                return res.status(404).json({ message: "Reminder not found" });
            }
            res.json(reminder);
        } catch (error) {
            console.error("Error fetching reminder:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async createReminder(req, res) {
        try {
            const userId = req.user?.id; // lấy từ token
        const { index, lowerThan, higherThan, repeatAfter } = req.body;
        if (!index) {
            return res.status(400).json({ message: "Invalid or missing 'index'" });
        }

        const result = await reminderService.addReminder(req.body, userId);
        res
            .status(201)
            .json({ message: "Reminder created", reminderId: result.id });
        } catch (error) {
        console.error("Error creating reminder:", error);
        res.status(500).json({ message: "Error creating reminder" });
        }
    }

    async deleteReminder(req, res) {
        try {
            const { id } = req.params;
            await reminderService.removeReminder(id);
            res.status(200).json({ message: "Reminder deleted" });
        } catch (error) {
            console.error("Error deleting reminder:", error);
            if (error.message === "Reminder not found") {
                return res.status(404).json({ message: "Reminder not found" });
            }
            res.status(500).json({ message: "Error deleting reminder" });
        }
    }

    async updateReminderStatus(req, res) {
        try {
            const { id } = req.params;
            const updatedReminder = await reminderService.toggleReminderStatus(id);
            res.status(200).json({ message: "Reminder status updated", reminder: updatedReminder });
        } catch (error) {
            console.error("Error updating reminder status:", error);
            res.status(500).json({ message: "Error updating reminder status" });
        }
    }


}

module.exports = new ReminderController();