import React from "react";
import { Card, Button, Row, Col, Select, Typography, Layout } from "antd";

import Incrementer from "../../components/Incrementer";
import useOrder from "./useOrder"; // El hook que manejamos
import "./Order.css";

const UPLOAD_FOLDER = import.meta.env.VITE_UPLOAD_FOLDER;

const { Content, Footer } = Layout;

export default function Order() {
  const {
    products,
    updateProductQuantity,
    handleCancel,
    formattedTotal,
    users,
    handleClientChange,
    selectedClient,
    handleSaveSale,
  } = useOrder(); // Usamos el hook y su función

  const renderProduct = (item) => (
    <Card
      key={`${item.id}-${Math.random()}`}
      className="product-card"
      hoverable
      bordered
      style={{ marginBottom: 16 }}
    >
      <Row align="middle" gutter={[16, 16]}>
        <Col span={4}>
          <img
            src={`${UPLOAD_FOLDER}${item.image}`}
            alt={item.name}
            style={{ borderRadius: 5, width: 65, height: 65 }}
          />
        </Col>
        <Col span={14}>
          <h4>{item.name}</h4>
          <p>{`${item.price} x 5`}</p>
        </Col>
        <Col span={6}>
          <Incrementer
            value={item.quantity || 0} // Mostrar la cantidad actual
            handleValue={(change) => updateProductQuantity(item.id, change)} // Actualizar la cantidad
          />
        </Col>
      </Row>
    </Card>
  );

  return (
    <Layout className="order-container">
      <div className="flex">
        <div className="flex">
          <p style={{ fontSize: "16px" }}>Cliente</p>
          <Select
            value={selectedClient}
            style={{ width: "100%" }}
            placeholder="Pesquisar cliente"
            onChange={handleClientChange}
            showSearch
            allowClear
            optionFilterProp="children"
            filterOption={(input, option) => {
              const email = option.value;
              return (
                typeof email === "string" &&
                email.toLowerCase().includes(input.toLowerCase())
              );
            }}
          >
            {users.map((user) => (
              <Select.Option key={user.id} value={user.id}>
                {user.email} {/* Asumimos que "email" es el campo a mostrar */}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="flex">
          <p style={{ fontSize: "16px" }}>Cantidad</p>
          <h3 style={{ fontSize: "24px" }}>
            {products.reduce(
              (total, product) => total + (product.quantity || 0),
              0
            )}
          </h3>
        </div>
        <div className="flex">
          <p style={{ fontSize: "16px" }}>Total</p>
          <h3 style={{ fontSize: "24px" }}>
            {formattedTotal(
              products.reduce(
                (total, product) =>
                  total + (product.quantity || 0) * product.price,
                0
              )
            )}
          </h3>
        </div>
      </div>

      {/* Contenido con Scroll */}
      <Content
        className="order-content"
        style={{ overflowY: "auto", height: "calc(100vh - 200px)" }}
      >
        <div className="order-list">
          {products.map((product) => renderProduct(product))}
        </div>
      </Content>

      {/* Pie de página */}
      <Footer style={{ textAlign: "center" }}>
        <Row justify="space-between" style={{ marginTop: 20 }}>
          <Col span={11}>
            <Button onClick={handleCancel} block type="default" danger>
              Cancelar
            </Button>
          </Col>
          <Col span={11}>
            <Button onClick={handleSaveSale} block type="primary">
              Confirmar
            </Button>
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
}
