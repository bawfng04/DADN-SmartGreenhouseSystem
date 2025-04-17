const { scheduleService } = require('../services/scheduleService');

class ScheduleController {

  // tạo schedule mới
  async createSchedule(req, res) {
      // lấy userid từ middleware authenticateToken
      console.log("get: ", req.user);
    const userId = req.user?.id;
      if (!userId) {
        console.log("User ID not found in request at /scheduleController.js");
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { feedKey, payload, delayMinutes } = req.body;
    if (!feedKey || !delayMinutes) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (typeof delayMinutes !== "number" || delayMinutes <= 0) {
      return res.status(400).json({ message: "Invalid delayMinutes" });
    }
    // fan và pump: 0-100
    // light-control: 0-1
    if (feedKey === "fan" || feedKey === "water-pump") {
      if (payload < 0 || payload > 100) {
        return res.status(400).json({
          message: "Invalid payload for fan or water pump. Must be between 0 and 100.",
        });
      }
    }
    else if (feedKey === "light-control") {
      if (payload != 0 && payload != 1) {
        return res.status(400).json({
          message: "Invalid payload for light control. Must be 0 or 1.",
        });
      }
    }
    try {
      //thời gian thực thi
      const executeAt = new Date(Date.now() + delayMinutes * 60 * 1000);
      const scheduleId = await scheduleService.createNewSchedule(
        userId,
        feedKey,
        payload,
        executeAt
      );
      return res
        .status(201)
        .json({ message: "Schedule created successfully", scheduleId });
    } catch (error) {
      console.error("Error creating schedule:", error);
      return res.status(500).json({ message: "Error creating schedule" });
    }
  }

    // lấy danh sách các task đang pending && executeAt <= now()
  async getPendingTasks(req, res) {
    try {
      const tasks = await scheduleService.getPendingTasks();
      return res.status(200).json(tasks);
    } catch (error) {
      console.error("Error getting pending tasks:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async cancelTask(req, res) {
    try {
      const taskId = req.params.taskId;
      if (!taskId) {
        return res.status(400).json({ message: "Task ID is required" });
      }
      await scheduleService.updateTaskStatus(taskId, "CANCELED");
      return res.status(200).json({ message: "Task canceled successfully" });
    }
    catch (error) {
      console.error("Error canceling task:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }


    // cập nhật task có id tương ứng
  async updateTaskStatus(req, res) {
    const { taskId, status } = req.body;
    if (!taskId || !status) {
      return res
        .status(400)
        .json({ message: "Task ID and status are required" });
    }
    try {
      await scheduleService.updateTaskStatus(taskId, status);
      return res
        .status(200)
        .json({ message: "Task status updated successfully" });
    } catch (error) {
      console.error("Error updating task status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new ScheduleController();