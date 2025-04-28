const WebSocket = require("ws");

let wss;
const clients = new Set(); // các client đang kết nối

function initWebSocketServer(server) {
  // Gắn WebSocket server vào HTTP server của Express
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("[WebSocket] Client connected");
    clients.add(ws); // add client

    ws.send(JSON.stringify({ type: 'WELCOME', message: `Connected to Websocket service` }));

    ws.on("message", (message) => {
        // Xử lý message từ client
        // chỉ log
      console.log("[WebSocket] Received:", message.toString());
    });

    ws.on("close", () => {
      console.log("[WebSocket] Client disconnected");
      clients.delete(ws); // Xóa client khỏi danh sách khi ngắt kết nối
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

  const message = JSON.stringify(data);
  console.log("[WebSocket] Broadcasting:", message);

  clients.forEach((client) => {
    // Chỉ gửi nếu client OPEN
    if (client.readyState === WebSocket.OPEN) {
      client.send(message, (err) => {
        if (err) {
          console.error("[WebSocket] Failed to send message to a client:", err);
          // clients.delete(client);
        }
      });
    } else if (client.readyState !== WebSocket.CONNECTING) {
      console.log("[WebSocket] Removing non-open client.");
      clients.delete(client);
    }
  });
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
      "Messages are JSON strings.",
      "Ensure your client handles reconnection if the connection drops.",
    ],
      exampleFormat: {
        // loại thông báo
      type: "DEVICE_UPDATE | SENSOR_ALERT | ...",
      payload: {
        // Dữ liệu cụ thể tùy thuộc vào 'type'
        // Ví dụ cho DEVICE_UPDATE:
        name: "fan",
        mode: "automatic",
        status: true,
        intensity: 100,
        updated_at: "2025-04-28T10:00:00.000Z",
      },
    },
  };
}

module.exports = {
  initWebSocketServer,
  broadcast,
  getWebSocketInfo,
};
