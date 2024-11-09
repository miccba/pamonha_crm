import { message, Spin } from "antd";
import React, { useEffect, useState } from "react";

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
    const eventSource = new EventSource(
      `https://brasil.hubify.com.ar/events?token=${token}`
    );

    eventSource.onmessage = (event) => {
      const newOrder = JSON.parse(event.data);
      console.log("Nuevo pedido recibido:", newOrder);

      if (userInteracted) {
        // Solo reproducir el sonido si el usuario ha interactuado
        new Audio("/sound/notification.mp3").play();
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
