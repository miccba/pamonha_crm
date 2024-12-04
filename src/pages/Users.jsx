import { useEffect, useState } from "react";
import { Table, Button, Tooltip, Input, Switch, message } from "antd";
import { jsPDF } from "jspdf";
import {
  EnvironmentOutlined,
  DeleteOutlined,
  PoweroffOutlined,
  KeyOutlined,
  SearchOutlined,
  PrinterOutlined,
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

  const handlePrinterClick = (record) => {
    console.log(record);

    const doc = new jsPDF();

    // Título

    doc.setFontSize(15);
    doc.text("Instruções para Instalação do Aplicativo Pamonha-Jet", 10, 10);
    doc.setFontSize(12);

    // Función para agregar texto con ajuste automático
    const addText = (text, y) => {
      const margin = 10; // Margen izquierdo
      const maxWidth = 180; // Ancho máximo del texto
      const lineHeight = 10; // Altura de la línea
      const textLines = doc.splitTextToSize(text, maxWidth); // Ajuste de texto
      doc.text(textLines, margin, y); // Agregar texto ajustado
      return y + textLines.length * lineHeight; // Devolver la nueva posición 'y'
    };

    // Passo 1
    let yPosition = 20;

    yPosition = addText("Passo 1: Escanear o código QR", yPosition);
    yPosition = addText("1. Localize o código QR fornecido.", yPosition);
    yPosition = addText(
      "2. Use a câmera do seu telefone ou um aplicativo de leitura de QR Code para escaneá-lo.",
      yPosition
    );

    // Passo 2
    yPosition = addText("Passo 2: Baixar o arquivo", yPosition);
    yPosition = addText(
      "1. Após escanear o código QR, você será redirecionado para uma página de download.",
      yPosition
    );
    yPosition = addText(
      "2. Clique no botão de download para obter o arquivo de instalação (APK) no seu dispositivo.",
      yPosition
    );

    // Passo 3
    yPosition = addText(
      "Passo 3: Permitir a instalação de aplicativos externos",
      yPosition
    );
    yPosition = addText(
      "1. Quando o download estiver concluído, tente abrir o arquivo.",
      yPosition
    );
    yPosition = addText(
      "2. O sistema solicitará autorização para instalar aplicativos de fontes desconhecidas.",
      yPosition
    );
    yPosition = addText(
      "   - Em dispositivos Android, ative esta opção nas configurações de segurança do seu telefone.",
      yPosition
    );
    yPosition = addText(
      "   - Nota importante: Esta autorização é necessária apenas para instalar este aplicativo e pode ser desativada depois.",
      yPosition
    );

    // Passo 4
    yPosition = addText("Passo 4: Finalizar a instalação", yPosition);
    yPosition = addText(
      "1. Confirme e siga as instruções na tela para concluir a instalação.",
      yPosition
    );
    yPosition = addText(
      "2. Após instalado, abra o aplicativo no menu do seu dispositivo.",
      yPosition
    );

    // Nota importante
    yPosition = addText("Nota importante", yPosition);
    yPosition = addText(
      "O arquivo de instalação requer autorização do proprietário do telefone para prosseguir com a instalação.",
      yPosition
    );
    yPosition = addText(
      "Se você não for o proprietário, consulte-o antes de continuar.",
      yPosition
    );

    // Dados de acesso
    yPosition = addText("Dados de acesso", yPosition);
    yPosition = addText(
      "Preencha as informações com os dados fornecidos:",
      yPosition
    );
    yPosition = addText(`- Usuário atribuído: ${record.email}`, yPosition);
    yPosition = addText(
      "- Senha atribuída: _______________________",
      yPosition
    );

    // Gerar o PDF como Blob
    const pdfBlob = doc.output("blob");

    // Criar URL do Blob
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Abrir o PDF em uma nova janela
    const printWindow = window.open(pdfUrl, "_blank");
    if (!printWindow) {
      alert(
        "Não foi possível abrir a janela. Verifique se os pop-ups estão habilitados."
      );
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
          <Tooltip title="Imprimir instruccioes">
            <Button
              icon={<PrinterOutlined />}
              onClick={() => handlePrinterClick(record)}
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
