import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import Constants from "expo-constants";
import { useAuth } from "./AuthContext";
const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};

const { websocketUrl } = extra;

interface DeviceMessage {
  type: string;
  payload: {
    name: string;
    mode: string;
    status: boolean;
    intensity: number;
    turn_off_after: string | null;
    turn_on_at: string | null;
    repeat: string | null;
    dates: string | null;
    updated_at: string;
  };
}

interface SensorMessage {
  type: string;
  payload: {
    id: string;
    index: string;
    higherThan: number | null;
    lowerThan: number | null;
    repeatAfter: number | null;
    active: boolean;
    updated_at: string;
  };
}
type MessageType = DeviceMessage | SensorMessage;

interface WebSocketContextType {
  socket: WebSocket | null;
  messages: MessageType[];
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const socketRef = useRef<WebSocket | null>(null);
  const appState = useRef(AppState.currentState);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const { token } = useAuth();
  useEffect(() => {
    if (!token) return;
    const connectSocket = () => {
      if (
        socketRef.current === null ||
        socketRef.current.readyState === WebSocket.CLOSED ||
        socketRef.current.readyState === WebSocket.CLOSING
      ) {
        const socket = new WebSocket(websocketUrl);
        socketRef.current = socket;

        socket.onopen = () => {
          console.log("[WebSocket] Connected");
        };

        socket.onmessage = (event) => {
          console.log("[WebSocket] Message:", event.data);
          const data = JSON.parse(event.data);
          setMessages((prevMessages) => [
            ...prevMessages,
            { type: data.type, payload: data.payload },
          ]);
        };

        socket.onerror = (error) => {
          console.error("[WebSocket] Error:", error);
        };

        socket.onclose = (event) => {
          console.log("Socket readyState:", socket.readyState);
          console.warn(
            `[WebSocket] Closed (code: ${event.code}, reason: ${event.reason})`
          );
        };
      }
    };

    setTimeout(() => {
      connectSocket();
    }, 1000);

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      const current = appState.current;
      appState.current = nextAppState;

      if (current === "active" && nextAppState.match(/inactive|background/)) {
        console.log("[AppState] Background: closing socket");
        socketRef.current?.close();
      }

      if (current.match(/inactive|background/) && nextAppState === "active") {
        console.log("[AppState] Foreground: reconnecting socket");
        setTimeout(() => {
          connectSocket();
        }, 1000);
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
      socketRef.current?.close();
      console.log("[WebSocket] Cleanup on unmount");
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket: socketRef.current, messages }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
