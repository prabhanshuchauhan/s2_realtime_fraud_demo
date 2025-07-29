"use client";

import useSWR from "swr";
import ReactECharts from "echarts-for-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function TopCities() {
  const { data, error } = useSWR("/api/fraud-top-cities", fetcher);

  if (error) return <p className="text-red-500">Error loading top cities</p>;
  if (!data) return <p>Loading top cities...</p>;

  const labels = data.cities.map((row: { city: string; country: string; fraud_count: number }) => `${row.city}, ${row.country}`);
  const values = data.cities.map((row: { city: string; country: string; fraud_count: number }) => row.fraud_count);

  const option = {
    title: {
      text: "Top Fraud Cities",
      left: "center",
      textStyle: { fontSize: 14, color: "#6B21A8" },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    xAxis: {
      type: "value",
    },
    yAxis: {
      type: "category",
      data: labels,
    },
    series: [
      {
        name: "Frauds",
        type: "bar",
        data: values,
        itemStyle: { color: "#A855F7" },
      },
    ],
    grid: { left: 100, right: 20, bottom: 30, top: 40 },
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <ReactECharts option={option} style={{ height: 400 }} />
    </div>
  );
}
