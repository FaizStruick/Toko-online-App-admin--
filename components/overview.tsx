"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface overViewProps {
    data: {
      name: string,
      total: number;
    }[];
};

export const Overview: React.FC<overViewProps> = ({ data }) => {
  // Mock data jika data transaksi dari backend masih kosong/belum ada
  const defaultData = [
    { name: "Jan", total: 0 },
    { name: "Feb", total: 0 },
    { name: "Mar", total: 0 },
    { name: "Apr", total: 0 },
    { name: "Mei", total: 0 },
    { name: "Jun", total: 0 },
    { name: "Jul", total: 0 },
    { name: "Agu", total: 0 },
    { name: "Sep", total: 0 },
    { name: "Okt", total: 0 },
    { name: "Nov", total: 0 },
    { name: "Des", total: 0 },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  const isAllZero = chartData.every((item) => item.total === 0);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          domain={(isAllZero ? [0, 100000] : [0, "auto"]) as [number, number | string]}
          tickFormatter={(value) => 
            `Rp ${new Intl.NumberFormat("id-ID").format(value)}`}
        />
        <Tooltip 
          formatter={(value) => [
            `Rp ${(Number(value) || 0).toLocaleString("id-ID")}`, "Total"
          ]}
            contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
        />
        <Bar
          dataKey="total"
          fill="#000000"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Overview;