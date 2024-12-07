import React from "react";
import { Button, Row, Col, Typography } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

const { Text } = Typography;

const Incrementer = ({ value, handleValue }) => {
  return (
    <Row align="middle" justify="center" gutter={[8, 0]}>
      <Col>
        <Button
          icon={<MinusOutlined />}
          shape="circle"
          onClick={() => value > 0 && handleValue(-5)} // Decrementa 5
        />
      </Col>
      <Col>
        <Text style={{ fontSize: 20 }}>{value}</Text>{" "}
        {/* Muestra el valor actual */}
      </Col>
      <Col>
        <Button
          icon={<PlusOutlined />}
          shape="circle"
          onClick={() => handleValue(5)} // Incrementa 5
        />
      </Col>
    </Row>
  );
};

export default Incrementer;
