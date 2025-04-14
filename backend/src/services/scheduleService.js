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
//     FOREIGN KEY (USER_ID) REFERENCES USERS(ID),
// )

class ScheduleService {
    // tạo schedule mới
    async createNewSchedule(userId, feedKey, payload, executeAt) {
        const query = 'INSERT INTO SCHEDULE_TASKS (USER_ID, FEED_KEY, PAYLOAD, EXECUTE_AT, STATUS, CREATED_AT, UPDATED_AT) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING ID';
        const values = [userId, feedKey, payload, executeAt, 'PENDING', new Date(), new Date()];
        try {
            const result = await pool.query(query, values);
            if (result.rows && result.rows.length > 0) {
                return result.rows[0].id; // return về ID của schedule
            }
         else {
            console.error('Error creating schedule:', error);
            throw error;
        }
    }
        catch (error) {
            console.error('Error creating schedule:', error);
            throw error;
        }
    }

    // lấy task đang pending && executeAt <= now()
    async getPendingTasks() {
        const query = 'SELECT * FROM SCHEDULE_TASKS WHERE STATUS = $1 AND EXECUTE_AT <= $2';
        const values = ['PENDING', new Date()];
        try {
            const result = await pool.query(query, values);
            return result.rows; // trả về danh sách các task đang pending
        } catch (error) {
            console.error('Error getting pending tasks:', error);
            throw error;
        }
    }


    // cập nhật trạng thái task
    async updateTaskStatus(taskId, status) {
        const query = 'UPDATE SCHEDULE_TASKS SET STATUS = $1, UPDATED_AT = CURRENT_TIMESTAMP WHERE ID = $2';
        const values = [status, taskId];
        try {
            await pool.query(query, values);
        } catch (error) {
            console.error('Error updating task status:', error);
            throw error;
        }
    }

}


module.exports = new ScheduleService();