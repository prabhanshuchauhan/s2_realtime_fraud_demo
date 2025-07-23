"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import useSWR from "swr";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type FraudPoint = {
  lat: number;
  lon: number;
  username: string;
  ts: string;
};

export default function LiveMap() {
  const { data, error } = useSWR("/api/fraud-map-points", fetcher, {
    refreshInterval: 5000,
  });

  const [frauds, setFrauds] = useState<FraudPoint[]>([]);

  useEffect(() => {
    if (data?.points) {
      setFrauds(data.points);
    }
  }, [data]);

  if (error) return <p>Error loading map</p>;

  return (
    <MapContainer
      center={[30, 0]}
      zoom={2}
      style={{ height: "400px", width: "100%" }}
      scrollWheelZoom={true}
      className="z-0"
    >
       <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {frauds.map((f, i) => (
        <CircleMarker
          key={i}
          center={[f.lat, f.lon]}
          radius={5}
          pathOptions={{ color: "#ff3b3b", fillOpacity: 0.8 }}
        >
          <Tooltip direction="top" offset={[0, -5]}>
            <div>
              <strong>{f.username}</strong>
              <br />
              {new Date(f.ts).toLocaleString()}
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
