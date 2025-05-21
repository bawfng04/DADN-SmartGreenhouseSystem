from flask import Flask, jsonify, redirect, request
from flasgger import Swagger
import re

app = Flask(__name__)
swagger = Swagger(app)

@app.route('/')
def index():
    return redirect("/apidocs")

@app.route('/indices')
def get_indices():
    """
    Trả về chỉ số mới nhất của các cảm biến
    ---
    tags:
      - Home
    responses:
      200:
        description: Danh sách chỉ số
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: string
              name:
                type: string
              value:
                type: string
        examples:
          application/json: [
            {"id": "1", "name": "temperature", "value": "23"},
            {"id": "2", "name": "humidity", "value": "50"},
            {"id": "3", "name": "soil_moisture", "value": "50"},
            {"id": "4", "name": "light", "value": "50"},
          ]
    """
    return jsonify([
            {"id": "1", "name": "temperature", "value": "23"},
            {"id": "2", "name": "humidity", "value": "50"},
            {"id": "3", "name": "soil_moisture", "value": "50"},
            {"id": "4", "name": "light", "value": "50"},
          ])

@app.route("/ws-info")
def get_ws_info():
    """
    Hướng dẫn kết nối WebSocket nhận thông báo từ hệ thống
    ---
    tags:
      - WebSocket
    responses:
      200:
        description: Thông tin kết nối WebSocket và định dạng dữ liệu
        content:
          application/json:
            examples:
              ws_connection:
                summary: Kết nối
                value:
                  ws_url: "ws://127.0.0.1:5000/ws"
                  protocol: "json"
                  description: "Client kết nối WebSocket để nhận thông báo thiết bị và nhắc nhở."
                  message_types:
                    - type: "device_activity"
                      description: "Thông báo khi thiết bị được bật/tắt"
                      payload_example:
                        type: "device_activity"
                        time: "2025-01-06T15:30:00"
                        name: "fan"
                        status: True
                        mode: "manual"
                        intensity: 50
                    - type: "reminder_alert"
                      description: "Thông báo khi đạt điều kiện nhắc nhở"
                      payload_example:
                        type: "reminder_alert"
                        time: "2025-01-06T15:30:00"
                        index: "temperature"
                        higher_than: "40"
    """
    return jsonify({
        "ws_url": "ws://127.0.0.1:5000/ws",
        "protocol": "json",
        "description": "Client kết nối WebSocket để nhận thông báo thiết bị và nhắc nhở.",
        "message_types": [
            {
                "type": "device_activity",
                "description": "Thông báo khi thiết bị được bật",
                "payload_example": {
                    "type": "device_activity",
                    "time": "2025-01-06T15:30:00",
                    "name": "fan",
                    "status": True,
                    "mode": "manual",
                    "intensity": 50
                }
            },
            {
                "type": "device_activity",
                "description": "Thông báo khi thiết bị được tắt",
                "payload_example": {
                    "type": "device_activity",
                    "time": "2025-01-06T15:30:00",
                    "name": "led",
                    "status": False,
                    "mode": "manual"
                }
            },
            {
                "type": "reminder_alert",
                "description": "Thông báo khi đạt điều kiện nhắc nhở",
                "payload_example": {
                    "type": "reminder_alert",
                    "time": "2025-01-06T15:30:00",
                    "index": "temperature",
                    "higher_than": "40"
                }
            },
            {
                "type": "reminder_alert",
                "description": "Thông báo khi đạt điều kiện nhắc nhở",
                "payload_example": {
                    "type": "reminder_alert",
                    "time": "2025-01-06T15:30:00",
                    "index": "soil_mositure",
                    "lower_than": "50"
                }
            }
        ]
    })

@app.route('/dashboard/<date>')
def get_dashboard(date):
    """
    Trả về 7 mốc dữ liệu trong ngày cho từng loại cảm biến
    ---
    tags:
      - Dashboard
    parameters:
      - name: date
        in: path
        required: true
        description: Ngày muốn lấy dữ liệu (YYYY-MM-DD)
        schema:
          type: string
    responses:
      200:
        description: Dữ liệu cảm biến theo ngày
        schema:
            type: object
            properties:
                temperature:
                    type: array
                    items:
                        type: object
                        properties:
                            value:
                                type: number
                            label:
                                type: string
                humidity:
                    type: array
                    items:
                        type: object
                        properties:
                            value:
                                type: number
                            label:
                                type: string
                soil_moisture:
                    type: array
                    items:
                        type: object
                        properties:
                            value:
                                type: number
                            label:
                                type: string
                light:
                    type: array
                    items:
                        type: object
                        properties:
                            value:
                                type: number
                            label:
                                type: string
        examples:
            application/json: {
                temperature: [
                { "value": 18, "label": "8" },
                { "value": 20, "label": "9" },
                { "value": 34, "label": "12" },
                { "value": 24, "label": "15" },
                { "value": 24, "label": "18" },
                { "value": 24, "label": "20" },
                { "value": 24, "label": "23" }
                ],
                humidity: [
                { "value": 18, "label": "8" },
                { "value": 20, "label": "9" },
                { "value": 34, "label": "12" },
                { "value": 24, "label": "15" },
                { "value": 24, "label": "18" },
                { "value": 24, "label": "20" },
                { "value": 24, "label": "23" }
                ],
                soil_moisture: [
                { "value": 18, "label": "8" },
                { "value": 20, "label": "9" },
                { "value": 34, "label": "12" },
                { "value": 24, "label": "15" },
                { "value": 24, "label": "18" },
                { "value": 24, "label": "20" },
                { "value": 24, "label": "23" }
                ],
                light: [
                { "value": 18, "label": "8" },
                { "value": 20, "label": "9" },
                { "value": 34, "label": "12" },
                { "value": 24, "label": "15" },
                { "value": 24, "label": "18" },
                { "value": 24, "label": "20" },
                { "value": 24, "label": "23" }
                ]
            }
    """
    # Dữ liệu mock
    data = {
        "temperature": [
            { "value": 18, "label": "8" },
            { "value": 20, "label": "9" },
            { "value": 34, "label": "12" },
            { "value": 24, "label": "15" },
            { "value": 24, "label": "18" },
            { "value": 24, "label": "20" },
            { "value": 24, "label": "23" }
        ],
        "humidity": [
            { "value": 18, "label": "8" },
            { "value": 20, "label": "9" },
            { "value": 34, "label": "12" },
            { "value": 24, "label": "15" },
            { "value": 24, "label": "18" },
            { "value": 24, "label": "20" },
            { "value": 24, "label": "23" }
        ],
        "soil_moisture": [
            { "value": 18, "label": "8" },
            { "value": 20, "label": "9" },
            { "value": 34, "label": "12" },
            { "value": 24, "label": "15" },
            { "value": 24, "label": "18" },
            { "value": 24, "label": "20" },
            { "value": 24, "label": "23" }
        ],
        "light": [
            { "value": 18, "label": "8" },
            { "value": 20, "label": "9" },
            { "value": 34, "label": "12" },
            { "value": 24, "label": "15" },
            { "value": 24, "label": "18" },
            { "value": 24, "label": "20" },
            { "value": 24, "label": "23" }
        ]
    }
    return jsonify(data)

@app.route('/reminders')
def get_reminders():
    """
    Trả về danh sách lời nhắc
    ---
    tags:
      - Reminder
    responses:
      200:
        description: Danh sách lời nhắc
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: string
              index:
                type: string
              higherThan:
                type: string
              lowerThan:
                type: string
              repeatAfter:
                type: string
              active:
                type: boolean

        examples:
          application/json: [
            {
                "id": "1",
                "index": "temperature",
                "higherThan": 40,
                "lowerThan": 19,
                "repeatAfter": 24,
                "active": true
            },
            {
                "id": "2",
                "index": "humidity",
                "lowerThan": 19,
                "active": false
            },
          ]

    """
    return jsonify([
            {
                "id": "1",
                "index": "temperature",
                "higherThan": 40,
                "lowerThan": 19,
                "repeatAfter": 24,
                "active": true
            },
            {
                "id": "2",
                "index": "humidity",
                "lowerThan": 19,
                "active": false
            },
          ])

@app.route('/reminders', methods=['POST'])
def create_reminder():
    """
    Tạo reminder mới
    ---
    tags:
      - Reminder
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            index:
              type: string
            lowerThan:
              type: object
              properties:
                value:
                  type: number
                status:
                  type: boolean
            higherThan:
              type: object
              properties:
                value:
                  type: number
                status:
                  type: boolean
            repeatAfter:
              type: object
              properties:
                value:
                  type: number
                status:
                  type: boolean
          example:
            index: "temperature"
            lowerThan:
              value: 50
              status: false
            higherThan:
              value: 80
              status: true
            repeatAfter:
              value: 10
              status: true
    responses:
      201:
        description: Reminder đã được tạo
    """
    data = request.json
    print(data)
    return jsonify({"message": "Reminder created"}), 201

@app.route('/reminders/<id>/status', methods=['PATCH'])
def update_reminder_status(id):
    """
    Cập nhật trạng thái reminder
    ---
    tags:
      - Reminder
    parameters:
      - in: path
        name: id
        required: true
        type: string
        description: ID của reminder
    responses:
      200:
        description: Trạng thái reminder đã được cập nhật
      404:
        description: Không tìm thấy reminder
    """
    print(f"Toggling status for reminder with id: {id}")
    return jsonify({"message": "Reminder status toggled successfully"}), 200

@app.route('/reminders/<id>', methods=['DELETE'])
def delete_reminder(id):
    """
    Xóa reminder
    ---
    tags:
      - Reminder
    parameters:
      - in: path
        name: id
        required: true
        type: string
        description: ID của reminder
    responses:
      200:
        description: Reminder đã được xóa
      404:
        description: Không tìm thấy reminder
    """
    print(f"Deleting reminder with id: {id}")
    return jsonify({"message": "Reminder deleted successfully"}), 200

@app.route('/settings')
def get_settings():
    """
    Trả về trạng thái các thiết bị
    ---
    tags:
      - Settings
    responses:
      200:
        description: Danh sách trạng thái
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: string
              name:
                type: string
              mode:
                type: string
              status:
                type: boolean
              intensity:
                type: number

        examples:
          application/json: [
  {
    "id": 1,
    "name": "led",
    "mode": "manual",
    "status": true,
    "intensity": 50
  },
  {
    "id": 2,
    "name": "fan",
    "mode": "manual",
    "status": false,
    "intensity": 50
  },
  {
    "id": 3,
    "name": "pump",
    "mode": "manual",
    "status": false,
    "intensity": 100
  }
]

    """
    return jsonify([
  {
    "id": 1,
    "name": "led",
    "mode": "manual",
    "status": true,
    "intensity": 50
  },
  {
    "id": 2,
    "name": "fan",
    "mode": "manual",
    "status": false,
    "intensity": 50
  },
  {
    "id": 3,
    "name": "pump",
    "mode": "manual",
    "status": false,
    "intensity": 100
  }
])

@app.route('/settings/<id>/status', methods=['PATCH'])
def update_setting_status(id):
    """
    Cập nhật trạng thái thiết bị
    ---
    tags:
      - Settings
    parameters:
      - in: path
        name: id
        required: true
        type: string
        description: ID của thiết bị
    responses:
      200:
        description: Trạng thái thiết bị đã được cập nhật
      404:
        description: Không tìm thấy thiết bị
    """
    print(f"Toggling status for device with id: {id}")
    return jsonify({"message": "Device status toggled successfully"}), 200

@app.route('/settings/<id>', methods=['GET'])
def get_setting(id):
    """
    Lấy thông tin thiết bị
    ---
    tags:
      - Settings
    parameters:
      - in: path
        name: id
        required: true
        type: string
        description: ID của thiết bị
    responses:
      200:
        description: Thông tin thiết bị
        schema:
          type: object
          properties:
            id:
              type: string
            name:
              type: string
            mode:
              type: string
              enum: [manual, scheduled, automatic]
            status:
              type: boolean
            intensity:
              type: integer
            turn_off_after:
              type: [integer, "null"]
              description: Thời gian tự động tắt sau x phút (chỉ có ở chế độ manual và scheduled)
            turn_on_at:
              type: string
              description: Thời gian bật thiết bị, định dạng "HH:MM" (chỉ có ở chế độ scheduled)
            repeat:
              type: string
              enum: [today, everyday, custom]
              description: Chế độ lặp lại (chỉ có ở chế độ scheduled)
            dates:
              type: array
              items:
                type: string
              description: Danh sách ngày lặp lại, định dạng "YYYY-MM-DD" (chỉ có khi repeat là "custom")
        examples:
          application/json:
            description: |
              In all modes, these fields are required:
                  id, name, mode, status, intensity
              In manual mode, there is an additional field:
                  turn_off_after (required) is null or x minutes
              In scheduled mode, there are additional fields:
                  turn_on_at (required) is the time to turn on the device, format: "HH:MM"
                  turn_off_after (required) x minutes (null is not allowed)
                  repeat (required) is "today", "everyday" or "custom"
                  dates (required if repeat is "custom") is an array of dates, format: "YYYY-MM-DD"
              In automatic mode, there are no additional fields
            value:
              id: 1
              name: "led"
              mode: "manual"
              status: true
              intensity: 50
              turn_off_after: null
    """

    # in all modes, these fields are required:
    #     id, name, mode, status, intensity
    #
    # in manual mode, there is an additional field:
    #     turn_off_after (required) is null or x minutes
    #
    # in scheduled mode, there are additional fields:
    #     turn_on_at (required) is the time to turn on the device, format: "HH:MM"
    #     turn_off_after (required) x minutes (null is not allowed)
    #     repeat (required) is "today", "everyday" or "custom"
    #     dates (required if repeat is "custom") is an array of dates, format: "YYYY-MM-DD"
    #
    # in automatic mode, there are no additional fields
    if id == "1":
        return jsonify({
            "id": 1,
            "name": "led",
            "mode": "manual",
            "status": True,
            "intensity": 50,
            "turn_off_after": None
        })
    elif id == "2":
        return jsonify({
            "id": 2,
            "name": "fan",
            "mode": "scheduled",
            "status": True,
            "intensity": 50,
            "turn_on_at": "10:00",
            "turn_off_after": 50,
            "repeat": "today"
        })
    elif id == "3":
        return jsonify({
            "id": 3,
            "name": "pump",
            "mode": "automatic",
            "status": True,
            "intensity": 50
        })
    else:
        return jsonify({"error": "Device not found"}), 404

@app.route('/settings/<id>', methods=['PUT'])
def update_setting(id):
    """
    Cập nhật thông tin thiết bị
    ---
    tags:
      - Settings
    parameters:
      - in: path
        name: id
        required: true
        type: string
        description: ID của thiết bị
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            id:
              type: string
            name:
              type: string
            mode:
              type: string
              enum: [manual, scheduled, automatic]
            status:
              type: boolean
            intensity:
              type: integer
            turn_off_after:
              type: [integer, "null"]
              description: Thời gian tự động tắt sau x phút (chỉ có ở chế độ manual và scheduled)
            turn_on_at:
              type: string
              description: Thời gian bật thiết bị, định dạng "HH:MM" (chỉ có ở chế độ scheduled)
            repeat:
              type: string
              enum: [today, everyday, custom]
              description: Chế độ lặp lại (chỉ có ở chế độ scheduled)
            dates:
              type: array
              items:
                type: string
              description: Danh sách ngày lặp lại, định dạng "YYYY-MM-DD" (chỉ có khi repeat là "custom")
    responses:
      200:
        description: Thông tin thiết bị đã được cập nhật
      404:
        description: Thiết bị không tồn tại
      400:
        description: Dữ liệu không hợp lệ
    """
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Validate required fields for all modes
    required_fields = ['name', 'mode', 'status', 'intensity']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    # Validate mode
    if data['mode'] not in ['manual', 'scheduled', 'automatic']:
        return jsonify({"error": "Invalid mode. Must be 'manual', 'scheduled', or 'automatic'"}), 400

    # Validate mode-specific fields
    if data['mode'] == 'manual':
        if 'turn_off_after' not in data:
            return jsonify({"error": "turn_off_after is required for manual mode"}), 400

    elif data['mode'] == 'scheduled':
        required_scheduled_fields = ['turn_on_at', 'turn_off_after', 'repeat']
        for field in required_scheduled_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field for scheduled mode: {field}"}), 400

        if data['repeat'] not in ['today', 'everyday', 'custom']:
            return jsonify({"error": "Invalid repeat value. Must be 'today', 'everyday', or 'custom'"}), 400

        if data['repeat'] == 'custom' and ('dates' not in data or not data['dates']):
            return jsonify({"error": "dates is required when repeat is 'custom'"}), 400

        # Validate time format HH:MM
        if not re.match(r'^([0-1][0-9]|2[0-3]):[0-5][0-9]$', data['turn_on_at']):
            return jsonify({"error": "turn_on_at must be in HH:MM format"}), 400

    # Mock successful update - in a real application, you would update a database here
    print(f"Updating device {id} with data:", data)
    return jsonify({"message": "Device updated successfully"}), 200

app.run(debug=True)