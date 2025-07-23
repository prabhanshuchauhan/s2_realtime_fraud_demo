"use client";

import useSWR from "swr";
import ReactECharts from "echarts-for-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function FraudChart() {
  const { data, error } = useSWR("/api/fraud-timeseries", fetcher);

  if (error) return <p className="text-red-500">Error loading chart</p>;
  if (!data) return <p>Loading chart...</p>;

  const dates = data.series.map((row: { fraud_date: string; fraud_count: number }) => row.fraud_date);
  const counts = data.series.map((row: { fraud_date: string; fraud_count: number }) => row.fraud_count);

  const option = {
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: dates,
      boundaryGap: false,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Fraud Count",
        type: "line",
        data: counts,
        areaStyle: {},
        smooth: true,
      },
    ],
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-purple-700 font-semibold mb-2">Frauds Over Time</h3>
      <ReactECharts option={option} style={{ height: 300 }} />
    </div>
  );
}
