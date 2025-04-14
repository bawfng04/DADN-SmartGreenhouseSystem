const scheduleService = require('../services/scheduleService');

class ScheduleController {
    async createSchedule(req, res) {
        // Lấy thông tin từ request body
        const { userId, feedKey, payload, executeAt } = req.body;
        if (!userId || !feedKey || !payload || !executeAt) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        try {
            const scheduleId = await scheduleService.createNewSchedule(userId, feedKey, payload, executeAt);
            return res.status(201).json({ message: 'Schedule created successfully', scheduleId });
        } catch (error) {
            console.error('Error creating schedule:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getPendingTasks(req, res) {
        try {
            const tasks = await scheduleService.getPendingTasks();
            return res.status(200).json(tasks);
        } catch (error) {
            console.error('Error getting pending tasks:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateTaskStatus(req, res) {
        const { taskId, status } = req.body;
        if (!taskId || !status) {
            return res.status(400).json({ message: 'Task ID and status are required' });
        }
        try {
            await scheduleService.updateTaskStatus(taskId, status);
            return res.status(200).json({ message: 'Task status updated successfully' });
        } catch (error) {
            console.error('Error updating task status:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }




}

module.exports = new ScheduleController();