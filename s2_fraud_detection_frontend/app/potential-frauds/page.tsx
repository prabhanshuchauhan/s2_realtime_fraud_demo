"use client";

import useSWR from "swr";
import { useState } from "react";
import { useRouter } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function FraudTablePage() {
  const [page, setPage] = useState(1);
  const router = useRouter();

  const { data, error, isLoading } = useSWR(`/api/potential-frauds?page=${page}`, fetcher, {
    refreshInterval: 10000,
  });

  if (error) return <p>Error loading frauds</p>;
  if (isLoading || !data) return <p>Loading frauds...</p>;

  return (
    <div className="space-y-4">
      <button onClick={() => router.push("/")} className="text-purple-600 hover:underline">
        ← Back to Dashboard
      </button>
      
      <h2 className="text-xl font-semibold">All Flagged Transactions</h2>

      <table className="table-auto w-full text-sm">
        <thead>
          <tr className="bg-purple-700 text-white">
            <th className="p-2">ID</th>
            <th className="p-2">User</th>
            <th className="p-2">Distance (km)</th>
            <th className="p-2">Speed (km/h)</th>
            <th className="p-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {data.frauds.map((f: { fraud_id: number; username: string; distance_km: number; speed_kmh: number; ts: string | number }) => (
            <tr
              key={f.fraud_id}
              className="cursor-pointer"
              onClick={() => router.push(`/frauds/${f.fraud_id}`)}
            >
              <td className="p-2">{f.fraud_id}</td>
              <td className="p-2">{f.username}</td>
              <td className="p-2">{f.distance_km.toFixed(1)}</td>
              <td className="p-2">{Math.round(f.speed_kmh)}</td>
              <td className="p-2">{new Date(f.ts).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center">
        <button
          disabled={page <= 1}
          className="px-3 py-1 border rounded disabled:opacity-30"
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </button>
        <span className="text-sm text-gray-500">
          Page {page} of {data.totalPages} ({data.total} total potential frauds)
        </span>
        <button
          disabled={page >= data.totalPages}
          className="px-3 py-1 border rounded disabled:opacity-30"
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
