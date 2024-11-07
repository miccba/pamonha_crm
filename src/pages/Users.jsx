import { useEffect, useState } from "react";
import { Table, Button, Tooltip, Input, Switch, message } from "antd";
import {
  EnvironmentOutlined,
  DeleteOutlined,
  PoweroffOutlined,
  KeyOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useAuth } from "../services/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const { getUsers, updateUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const handleGpsClick = (userId) => {
    console.log("GPS clickeado para el usuario con ID:", userId);
  };

  const handleDeleteClick = (userId) => {
    console.log("Eliminar clickeado para el usuario con ID:", userId);
  };

  const handleChangePasswordClick = (userId) => {
    console.log("Cambiar contraseña clickeado para el usuario con ID:", userId);
  };

  const handleStatusChange = async (checked, UserId) => {
    try {
      await updateUser(UserId, {
        data: {
          active: checked,
        },
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === UserId ? { ...user, active: checked } : user
        )
      );
      message.success("Usuário actualizado correctamente");
    } catch (error) {
      message.error("Error al actualizar el Usuário.");
    }
  };

  const columns = [
    {
      title: "Nome Completo",
      key: "fullName",
      render: (text, record) => `${record.name} ${record.surname}`,
      // Filtro por Nombre Completo
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar por nombre"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Pesquisar
          </Button>
          <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
            Limpar
          </Button>
        </div>
      ),
      onFilter: (value, record) =>
        `${record.name} ${record.surname}`
          .toLowerCase()
          .includes(value.toLowerCase()),
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
      // Filtro por Email
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Pesquisar por e-mail"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Pesquisar
          </Button>
          <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
            Limpar
          </Button>
        </div>
      ),
      onFilter: (value, record) =>
        record.email.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Ativo",
      dataIndex: "active",
      key: "active",
      render: (active, record) => (
        <Switch
          checked={active}
          onChange={(checked) => handleStatusChange(checked, record.id)}
        />
      ),
    },
    {
      title: "Ações",
      key: "actions",
      render: (text, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Tooltip title="Ver ubicación">
            <Button
              icon={<EnvironmentOutlined />}
              onClick={() => handleGpsClick(record.id)}
            />
          </Tooltip>
          <Tooltip title="Eliminar usuario">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteClick(record.id)}
              danger
            />
          </Tooltip>
          <Tooltip title="Cambiar contraseña">
            <Button
              icon={<KeyOutlined />}
              onClick={() => handleChangePasswordClick(record.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2>Usuários</h2>
      <Table dataSource={users} columns={columns} rowKey="id" />
    </div>
  );
};

export default Users;
