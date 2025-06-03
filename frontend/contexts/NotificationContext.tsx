import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useWebSocket } from "./WebSocketProvider";
import { apiCall } from "@/utils/apiCall";
import { useAuth } from "./AuthContext";

interface MessageType {
  id: number;
  is_read: boolean;
  message: string;
  related_entity_id: string;
  timestamp: string;
  type: string;
  user_id: number;
}

type NotificationContextType = {
  notifications: MessageType[];
};

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
});

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const webSocketContext = useWebSocket();
  const messages = webSocketContext?.messages || [];
  const [notifications, setNotifications] = useState<MessageType[]>([]);
  const hasFetched = useRef(false);
  const { token } = useAuth();

  useEffect(() => {
    if (!hasFetched.current) {
      apiCall({
        method: "GET",
        endpoint: "/notifications",
      }).then((data) => {
        setNotifications(data);
        hasFetched.current = true;
      });
    }
  }, []);
  useEffect(() => {
    if (!token || hasFetched.current) return;

    const fetchNotifications = async () => {
      try {
        const data = await apiCall({
          method: "GET",
          endpoint: "/notifications",
        });
        setNotifications(data);
        hasFetched.current = true;
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchNotifications();
  }, [token]);

  useEffect(() => {
    const merge = () => {
      const uniqueNotifications = Array.from(
        new Set([...notifications, ...messages])
      );

      setNotifications(uniqueNotifications);
    };

    merge();
  }, [messages]);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
