import { useEffect, useState } from "react";
import { useAuth } from "../services/api";
import { Card, Col, Row, Statistic } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Loader from "../components/Loader";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Stats = () => {
  const [stats, setStats] = useState(null);
  const { getStats } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      const data = await getStats();
      setStats(data);
    };

    fetch();
  }, []);

  if (!stats) {
    return (
      <div style={{ textAlign: "center" }}>
        <Loader />
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  const chartData = stats.dailySales.map((sale) => ({
    date: format(new Date(sale.date), "dd/MM/yyyy", { locale: ptBR }), // Formato brasileño
    totalSales: parseFloat(sale.totalSales), // Convertimos totalSales a número
  }));

  return (
    <div>
      <Row gutter={24}>
        <Col span={6}>
          <Card>
            <Statistic title="Usuários ativos" value={stats.activeUsers} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Usuário que compra mais"
              value={`${stats.userWithMostPurchases.name} - R$ ${stats.userWithMostPurchases.totalSpent}`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Produto mais vendido"
              value={stats.bestSellingProduct.name}
              suffix={`(${stats.bestSellingProduct.totalSold} vendidos)`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Usuários ociosos" value={stats.inactiveUsers} />
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Card title="Vendas diárias">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar name="Vendas" dataKey="totalSales" fill="#4D9D2C" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Stats;
