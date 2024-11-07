import { useEffect, useState } from "react";
import { Table, Button, Modal, Input, message, Switch, Tooltip } from "antd";
import { useAuth } from "../services/api";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const UPLOAD_FOLDER = import.meta.env.VITE_UPLOAD_FOLDER;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const { getProducts, updateProduct } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      const data = await getProducts();
      setProducts(data);
    };

    fetch();
  }, []);

  const handleStatusChange = async (checked, productId) => {
    try {
      await updateProduct(productId, {
        data: {
          disabled: !checked,
        },
      });
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? { ...product, disabled: !checked }
            : product
        )
      );
      message.success("Producto actualizado correctamente");
    } catch (error) {
      message.error("Error al actualizar el producto.");
    }
  };

  const showModal = (product) => {
    setCurrentProduct(product);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const { id, name, price } = currentProduct;

      if (!name.trim() || !price.trim()) {
        message.error("Por favor preencha ambos os campos (Nome e Preço).");
        return;
      }
      if (parseFloat(price) <= 0) {
        message.error("O preço deve ser maior que 0.");
        return;
      }

      await updateProduct(id, {
        data: {
          name,
          price,
        },
      });

      setIsModalVisible(false);
      message.success("Producto actualizado correctamente");
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id ? { ...product, name, price } : product
        )
      );
    } catch (error) {
      message.error("Error al actualizar el producto.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleChange = (e, field) => {
    setCurrentProduct({ ...currentProduct, [field]: e.target.value });
  };

  const handleDelete = async (productId) => {
    try {
      // await deleteProduct(productId); // Llamada a la API para eliminar el producto
      //  message.success("Produto removido com sucesso");
      //  setProducts((prevProducts) =>
      //    prevProducts.filter((product) => product.id !== productId)
      //  ); // Actualizar la lista
    } catch (error) {
      message.error("Erro ao excluir produto");
    }
  };

  const columns = [
    {
      title: "Produto",
      dataIndex: "image",
      key: "image",
      render: (image, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={`${UPLOAD_FOLDER}${image}`}
            alt="Produto"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              objectFit: "cover",
              marginRight: "10px",
            }}
          />
          <span>{record.name}</span>
        </div>
      ),
    },
    {
      title: "Preço",
      dataIndex: "price",
      key: "price",
      render: (price) => {
        return `R$ ${parseFloat(price).toFixed(2).replace(".", ",")}`;
      },
    },
    {
      title: "Disponível",
      dataIndex: "disabled",
      key: "disabled",
      render: (disabled, record) => (
        <Switch
          checked={!disabled}
          onChange={(checked) => handleStatusChange(checked, record.id)}
        />
      ),
    },
    {
      title: "Ações",
      key: "actions",
      render: (text, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Tooltip title="Editar">
            <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
          </Tooltip>
          <Tooltip title="Excluir produ">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
              danger
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const handlePriceChange = (e) => {
    let value = e.target.value;
    const regex = /^[0-9]+(\.[0-9]{0,2})?$/;
    if (regex.test(value) || value === "") {
      handleChange(e, "price");
    }
  };

  return (
    <div>
      <h2>Produtos</h2>
      <Table dataSource={products} columns={columns} rowKey="id" />
      <Modal
        title="Editar Produto"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          value={currentProduct?.name}
          onChange={(e) => handleChange(e, "name")}
          placeholder="Nome do Produto"
        />
        <Input
          value={currentProduct?.price}
          onChange={handlePriceChange}
          placeholder="Preço"
          style={{ marginTop: "10px" }}
        />
      </Modal>
    </div>
  );
};

export default Products;
