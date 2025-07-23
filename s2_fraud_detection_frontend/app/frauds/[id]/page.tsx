"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";

const MapViewer = dynamic(() => import("../../components/MapViewer"), { ssr: false });

export default function FraudMapPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<{
    tx1: { lat: number; lon: number; ts: string | number };
    tx2: { lat: number; lon: number; ts: string | number };
    username: string;
    distance_km: number;
    secs: number;
    speed_kmh: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/frauds/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-6">Loading map...</p>;
  if (!data) return <p className="p-6 text-red-600">Error loading map data</p>;

  const { tx1, tx2, username, distance_km, secs, speed_kmh } = data;

  return (
    <main className="p-6 space-y-6">
      <button onClick={() => router.push("/potential-frauds")} className="text-purple-600 hover:underline">
        ← Back to Flagged transactions
      </button>

      <h1 className="text-2xl font-bold">Fraud #{id}</h1>
      <p className="text-sm text-gray-500">User: <strong>{username}</strong></p>

      <section className="p-4 rounded shadow text-sm space-y-1">
        <p><strong>Distance:</strong> {distance_km.toFixed(1)} km</p>
        <p><strong>Time Gap:</strong> {secs} seconds</p>
        <p><strong>Speed:</strong> {Math.round(speed_kmh)} km/h</p>
      </section>

      <MapViewer tx1={tx1} tx2={tx2} />
    </main>
  );
}
