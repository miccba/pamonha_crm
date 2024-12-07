import { useState, useEffect } from "react";
import { useAuth } from "../../services/api";
import { message } from "antd";

export default function useOrder() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const { getProducts, getUsers, postOrder } = useAuth();
  const [selectedClient, setSelectedClient] = useState(null);

  // Función para actualizar la cantidad de un producto
  const updateProductQuantity = (productId, quantityChange) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, quantity: (product.quantity || 0) + quantityChange }
          : product
      )
    );
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        const user = await getUsers();
        const sortedUsers = user.sort((a, b) => {
          const numA = a.email.match(/\d+/)
            ? parseInt(a.email.match(/\d+/)[0], 10)
            : 0;
          const numB = b.email.match(/\d+/)
            ? parseInt(b.email.match(/\d+/)[0], 10)
            : 0;
          return numA - numB; // Orden ascendente
        });
        setProducts(data);
        setUsers(sortedUsers);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleCancel = () => {
    setProducts(products.map((product) => ({ ...product, quantity: 0 })));
    setSelectedClient(null);
  };

  const formattedTotal = (total) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(total);
  };

  const handleClientChange = (value) => {
    setSelectedClient(value); // Guarda el ID del cliente seleccionado
  };

  const handleSaveSale = async () => {
    const productEmpty = products.filter((item) => item.quantity > 0);

    if (!selectedClient) {
      message.error("Escolha um cliente");
      return;
    }

    if (!productEmpty.length) {
      message.error("Escolha um produto");
      return;
    }

    const customerOrder = {
      order: {
        UserId: selectedClient,
        total: products.reduce(
          (total, product) => total + (product.quantity || 0) * product.price,
          0
        ),
        PaymentMethodId: "86ca0de9-b347-4593-9719-7e6e26912562",
      },
      products: products
        .filter((item) => item.quantity > 0)
        .map(({ id, price, quantity }) => ({
          ProductId: id,
          CookTypeId: "85f4a6ce-c52d-493f-a325-daa9b3d03a54",
          price,
          quantity: quantity,
          additionals: [],
        })),
      drinks: [],
    };

    try {
      await postOrder(customerOrder);
      message.success("Pedido criado");
      handleCancel();
    } catch (error) {
      console.log(error);
    }
  };

  return {
    products,
    updateProductQuantity,
    handleCancel,
    formattedTotal,
    users,
    handleClientChange,
    selectedClient,
    handleSaveSale,
  };
}
