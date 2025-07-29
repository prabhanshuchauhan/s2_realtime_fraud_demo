"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SummaryStats() {
  const { data, error } = useSWR("/api/stats", fetcher, {
    refreshInterval: 5000,
  });

  if (error) return <p className="text-red-500">Failed to load stats</p>;
  if (!data) return <p>Loading stats...</p>;

  const { total_transactions, total_frauds, last_updated } = data;
  const formattedTime = new Date(last_updated).toLocaleString('en-US', {
    timeZone: 'Asia/Tokyo'
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="rounded-xl bg-purple-50 dark:bg-purple-900 p-4 shadow">
        <p className="text-sm text-gray-600 dark:text-gray-300">Total Transactions</p>
        <p className="text-2xl font-semibold text-purple-700 dark:text-purple-200">
          {total_transactions.toLocaleString()}
        </p>
      </div>
      <div className="rounded-xl bg-red-50 dark:bg-red-900 p-4 shadow">
        <p className="text-sm text-gray-600 dark:text-gray-300">Total Frauds Detected</p>
        <p className="text-2xl font-semibold text-red-600 dark:text-red-200">
          {total_frauds.toLocaleString()}
        </p>
      </div>
      <div className="rounded-xl bg-gray-100 dark:bg-gray-800 p-4 shadow">
        <p className="text-sm text-gray-600 dark:text-gray-300">Last Updated</p>
        <p className="text-lg font-medium text-gray-800 dark:text-gray-100">
          {formattedTime}
        </p>
      </div>
    </div>
  );
}
