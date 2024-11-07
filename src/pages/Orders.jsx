import { useEffect, useState } from "react";
import { Button, message, Select, Table, Tooltip } from "antd";
import { useAuth } from "../services/api";
import {
  SendOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const UPLOAD_FOLDER = import.meta.env.VITE_UPLOAD_FOLDER;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("Em espera");
  const { getOrders, changeStatusOrder } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      const data = await getOrders();
      setOrders(data);
      filterOrders("stand", data);
    };

    fetch();
  }, []);

  const filterOrders = (status, ordersList = orders) => {
    const filtered = ordersList.filter((order) => order.status === status);
    setFilteredOrders(filtered);
  };

  const columns = [
    { title: "Orden", dataIndex: "orderNumber", key: "orderNumber" },
    {
      title: "Data",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => {
        return new Date(createdAt).toLocaleDateString("pt-BR");
      },
    },
    {
      title: "Cliente",
      key: "customer",
      render: (record) => `${record.User.name} ${record.User.surname}`,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total) => {
        return `R$ ${parseFloat(total).toFixed(2).replace(".", ",")}`;
      },
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          {status !== "processing" && (
            <Tooltip title="Processar">
              <Button
                onClick={() => handleStatusChange("processing", record.id)}
                icon={<ClockCircleOutlined />}
              />
            </Tooltip>
          )}
          {status === "processing" && (
            <Tooltip title="Enviar">
              <Button
                onClick={() => handleStatusChange("sending", record.id)}
                icon={<SendOutlined />}
              />
            </Tooltip>
          )}
          {status === "sending" && (
            <Tooltip title="Entregue">
              <Button
                onClick={() => handleStatusChange("delivered", record.id)}
                icon={<CheckCircleOutlined />}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  const productsColumns = [
    {
      title: "Producto",
      dataIndex: ["Product", "name"],
      key: "productName",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            width={50}
            height={50}
            src={`${UPLOAD_FOLDER}${record.Product.image}`}
            style={{ borderRadius: "50%", marginRight: 10 }}
            alt={record.Product.name}
          />
          {text}
        </div>
      ),
    },
    { title: "Cantidad", dataIndex: "quantity", key: "quantity" },
  ];

  const expandedRowRender = (order) => {
    return (
      <Table
        columns={productsColumns}
        dataSource={order.OrderProducts}
        pagination={false}
        rowClassName="nested-row"
        rowKey={(record) => record.Product.name}
      />
    );
  };

  const handleStatusChange = async (status, id) => {
    setFilterStatus(status);
    filterOrders(status);

    if (typeof id === "string") {
      try {
        await changeStatusOrder({
          data: {
            status: status,
            OrderId: id,
          },
        });
        message.success(`Pedido atualizada.`);
      } catch (error) {
        message.error("Erro ao atualizar o status do pedido.");
      }
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Select
          value={filterStatus}
          onChange={handleStatusChange}
          style={{ width: 200 }}
        >
          <Select.Option value="stand">Em espera</Select.Option>
          <Select.Option value="processing">Processando</Select.Option>
          <Select.Option value="sending">Enviando</Select.Option>
          <Select.Option value="delivered">Entregue</Select.Option>
        </Select>
      </div>
      <Table
        dataSource={filteredOrders}
        columns={columns}
        rowKey="id"
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => record.OrderProducts.length > 0,
        }}
      />
    </div>
  );
};

export default Orders;
