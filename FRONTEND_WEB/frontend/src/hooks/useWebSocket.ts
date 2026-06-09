import { useEffect } from "react";
import toast from "react-hot-toast";

type WsAlert = {
  id: number;
  person_id: number;
  camera_id: number;
  gravity_level: string;
  confidence: number;
  created_at: string;
  person_name?: string;
  camera_name?: string;
};

const useWebSocket = (onAlertReceived?: (alert: WsAlert) => void) => {
  useEffect(() => {
    let socket: WebSocket;
    let timeoutId: number | undefined;

    const connect = () => {
      const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const wsUrl = rawApiUrl.replace(/^http/, "ws") + "/ws";
      
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log("WebSocket connected to TogoSecureNet backend");
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "alert" || data.id) {
            const alert = data.alert || data;
            
            // Notification toast en fonction de la gravité
            const message = `Alerte ${alert.gravity_level.toUpperCase()} : ${alert.person_name || `Individu #${alert.person_id}`} détecté sur ${alert.camera_name || `Caméra #${alert.camera_id}`}`;
            
            if (alert.gravity_level === "critical") {
              toast.error(message, { duration: 8000, icon: "🚨" });
            } else if (alert.gravity_level === "high") {
              toast.error(message, { duration: 6000, icon: "⚠️" });
            } else {
              toast.success(message, { duration: 4000, icon: "🔍" });
            }

            if (onAlertReceived) {
              onAlertReceived(alert);
            }
          }
        } catch (e) {
          console.error("Failed to parse WebSocket message:", e);
        }
      };

      socket.onclose = () => {
        console.log("WebSocket disconnected. Retrying in 5 seconds...");
        timeoutId = window.setTimeout(connect, 5000);
      };

      socket.onerror = (err) => {
        console.error("WebSocket error:", err);
        socket.close();
      };
    };

    connect();

    return () => {
      if (socket) socket.close();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [onAlertReceived]);
};

export default useWebSocket;
