import { message, Spin } from "antd";
import React, { useEffect, useState } from "react";

//const URL_BASE = "http://localhost:5174";
const URL_BASE = "https://pamonha.snowy-grass-6e9e.workers.dev";

const Notifications = () => {
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    // Detecta cualquier interacción del usuario con la página
    const handleUserInteraction = () => setUserInteracted(true);

    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("keydown", handleUserInteraction);

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const eventSource = new EventSource(`${URL_BASE}/events?token=${token}`);

    eventSource.onerror = (error) => {
      console.log("Error en la conexión SSE:", error);
      eventSource.close();
    };

    eventSource.onmessage = (event) => {
      const newOrder = JSON.parse(event.data);
      console.log("Nuevo pedido recibido:", newOrder);

      if (userInteracted) {
        try {
          new Audio("/sound/notification.mp3").play();
        } catch (error) {
          console.error("Error al reproducir sonido de notificación:", error);
        }
      }
      message.info(`Nuevo pedido recibido con ID: ${newOrder.orderNumber}`);
    };

    return () => {
      eventSource.close();
    };
  }, [userInteracted]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        color: "#FFF",
        marginLeft: "25px",
      }}
    >
      <Spin style={{ marginRight: "10px" }} />
      <p>Alerta de pedidos</p>
    </div>
  );
};

export default Notifications;
