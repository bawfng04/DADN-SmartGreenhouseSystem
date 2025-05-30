const WebSocket = require("ws");

let wss;
const clients = new Set();

function initWebSocketServer(server) {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("[WebSocket] Client connected");
    clients.add(ws);

    ws.send(
      JSON.stringify({
        type: "WELCOME",
        message: `Connected to Websocket service`,
      })
    );

    ws.on("message", (message) => {
      // Xử lý message từ client
      // chỉ log
      console.log("[WebSocket] Received:", message.toString());
    });

    ws.on("close", () => {
      console.log("[WebSocket] Client disconnected");
      clients.delete(ws); // Xóa client khi disconnect
    });

    ws.on("error", (error) => {
      console.error("[WebSocket] Error:", error);
      clients.delete(ws); // error -> xoá client
    });
  });

  console.log("[WebSocket] Server initialized and attached to HTTP server.");
}

// Gửi thông báo tới tất cả clients
function broadcast(data) {
  if (!wss) {
    console.warn("[WebSocket] Server not initialized. Cannot broadcast.");
    return;
  }

  // Format message giống với notification API
  const formattedMessage = {
    id: generateId(), // tạo id giả
    user_id: data.payload?.userId || null, // Lấy từ payload hoặc null
    message: generateMessageFromPayload(data),
    type: data.type,
    is_read: false, // mặc định là unread
    related_entity_id: data.payload?.name || data.payload?.index || "",
    timestamp: new Date().toISOString(),
  };

  const message = JSON.stringify(formattedMessage);
  console.log("[WebSocket] Broadcasting:", message);

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message, (err) => {
        if (err) {
          console.error("[WebSocket] Failed to send message to a client:", err);
        }
      });
    } else if (client.readyState !== WebSocket.CONNECTING) {
      console.log("[WebSocket] Removing non-open client.");
      clients.delete(client);
    }
  });
}

// Helper function để generate message từ payload
function generateMessageFromPayload(data) {
  switch (data.type) {
    case "DEVICE_UPDATE":
      return `Device ${data.payload.name} has been updated`;
    case "REMINDER_ALERT":
      return data.payload.message || "Reminder alert triggered";
    case "SENSOR_ALERT":
      return `Sensor ${data.payload.index} alert: ${data.payload.message}`;
    default:
      return "System notification";
  }
}

// Generate temporary ID cho WebSocket messages
function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

// lấy info cho /api/websocket-info
function getWebSocketInfo(req) {
  // Render -> wss://
  // localhost:8000 -> ws://localhost:8000
  const host = req.get("host"); // Lấy host từ request header (localhost:8000, https://dadn-2.onrender.com)
  const protocol =
    req.protocol === "https" || req.headers["x-forwarded-proto"] === "https"
      ? "wss"
      : "ws";
  const wsUrl = `${protocol}://${host}`;

  return {
    message:
      "Connect to the WebSocket server using the URL below to receive real-time updates.",
    websocketUrl: wsUrl,
    connectionNotes: [
      "The server will push messages when device settings change or other relevant events occur.",
      "Messages are JSON strings formatted like notification API.",
      "Ensure your client handles reconnection if the connection drops.",
    ],
    exampleFormat: {
      id: 123,
      user_id: 2,
      message: "Device fan has been updated",
      type: "DEVICE_UPDATE",
      is_read: false,
      related_entity_id: "fan",
      timestamp: "2025-05-30T14:59:17.677Z",
    },
  };
}

module.exports = {
  initWebSocketServer,
  broadcast,
  getWebSocketInfo,
};
