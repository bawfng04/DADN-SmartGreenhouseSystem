const pool = require("../database/PostgreDatabase").pool;

// tạo mấy cái hẹn giờ

// CREATE TABLE SCHEDULE_TASKS(
//     ID INT PRIMARY KEY,
//     USER_ID INT NOT NULL,
//     FEED_KEY VARCHAR(255) NOT NULL,
//     PAYLOAD VARCHAR(255) NOT NULL,
//     EXECUTE_AT TIMESTAMP NOT NULL,
//     STATUS VARCHAR(255) NOT NULL DEFAULT 'PENDING',
//     CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (USER_ID) REFERENCES USERS(ID)
// )

const {
  createAdafruitFanData,
  createAdafruitLightControlData,
  createAdafruitWaterPumpData,
} = require("../controllers/adafruitController");


class ScheduleService {
  // tạo schedule mới
  async createNewSchedule(userId, feedKey, payload, executeAt) {
    const query =
      "INSERT INTO SCHEDULE_TASKS (USER_ID, FEED_KEY, PAYLOAD, EXECUTE_AT, STATUS, CREATED_AT, UPDATED_AT) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING ID";
    const values = [
      userId,
      feedKey,
      payload,
      executeAt,
      "PENDING",
    ];
    try {
      const result = await pool.query(query, values);
      if (result.rows && result.rows.length > 0) {
        return result.rows[0].id; // return về ID của schedule
      } else {
        console.error("Error creating schedule:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error creating schedule:", error);
      throw error;
    }
  }

//   // lấy task đang pending && executeAt <= now()
//   async getPendingTasks() {
//     const query =
//       "SELECT * FROM SCHEDULE_TASKS WHERE STATUS = $1 AND EXECUTE_AT <= $2";
//     const values = ["PENDING", new Date()];
//     try {
//       const result = await pool.query(query, values);
//       return result.rows; // trả về danh sách các task đang pending
//     } catch (error) {
//       console.error("Error getting pending tasks:", error);
//       throw error;
//     }
//   }

  // cập nhật trạng thái task
  async updateTaskStatus(taskId, status) {
    const query =
      "UPDATE SCHEDULE_TASKS SET STATUS = $1, UPDATED_AT = CURRENT_TIMESTAMP WHERE ID = $2";
    const values = [status, taskId];
    try {
      await pool.query(query, values);
    } catch (error) {
      console.error("Error updating task status:", error);
      throw error;
    }
  }

  // lấy các task đang pending && executeAt <= now()
  async getPendingTasksToExecute() {
    // Sử dụng NOW() của PostgreSQL để so sánh thời gian
    const query =
      "SELECT * FROM SCHEDULE_TASKS WHERE STATUS = $1 AND EXECUTE_AT <= NOW() ORDER BY EXECUTE_AT ASC";
    const values = ["PENDING"];
    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error("Error getting pending tasks to execute:", error);
      throw error; // Ném lỗi để hàm gọi xử lý
    }
  }

  // Hàm xử lý và thực thi các task
  async processPendingTasks() {
    console.log("Checking for pending scheduled tasks...");
    let tasksProcessed = 0;
      try {
        // lấy các task cần thực thi
        const tasks = await this.getPendingTasksToExecute();
        console.log("tasks in scheduleService.js: ", tasks);
      if (tasks.length === 0) {
        console.log("No pending tasks to execute.");
        return;
      }

      console.log(`Found ${tasks.length} tasks to execute.`);

          // lấy từng task thực thi
      for (const task of tasks) {
        console.log(
          `Processing task ID: ${task.id}, Feed: ${task.feed_key}, Payload: ${task.payload}`
        );
        try {
          let result;
          // Thực thi hành động dựa trên feed_key
          switch (task.feed_key) {
            case "fan":
              result = await createAdafruitFanData(parseInt(task.payload, 10));
              break;
            case "light-control":
              result = await createAdafruitLightControlData(
                parseInt(task.payload, 10)
              );
              break;
            case "water-pump":
              result = await createAdafruitWaterPumpData(
                parseInt(task.payload, 10)
              );
              break;
            default:
              console.error(
                `Unknown feed_key for task ID ${task.id}: ${task.feed_key}`
              );
              // Cập nhật trạng thái FAILED nếu feed_key không hợp lệ
              await this.updateTaskStatus(task.id, "FAILED");
              continue; // Bỏ qua task này
          }

          console.log(
            `Task ID ${task.id} executed successfully. Result:`,
            result
          );
          // Cập nhật trạng thái COMPLETED
          await this.updateTaskStatus(task.id, "COMPLETED");
          tasksProcessed++;
        } catch (executionError) {
          console.error(`Error executing task ID ${task.id}:`, executionError);
          // Cập nhật trạng thái FAILED
          await this.updateTaskStatus(task.id, "FAILED");
        }
      }
      console.log(`Finished processing tasks. Processed: ${tasksProcessed}`);
    } catch (error) {
      console.error("Error during task processing cycle:", error);
    }
  }
}

// Tạo một instance của ScheduleService để sử dụng trong các phần khác của app
const scheduleServiceInstance = new ScheduleService();

// 10s 1 lần
function startScheduler(interval = 20000) {
    console.log("Scheduler started. Checking for pending tasks every minute (scheduleService.js).");
    //chạy lần đầu
    scheduleServiceInstance.processPendingTasks();
  setInterval(() => {
    scheduleServiceInstance.processPendingTasks();
  }, interval);
}

module.exports = {
    scheduleService: scheduleServiceInstance,
    startScheduler,
}