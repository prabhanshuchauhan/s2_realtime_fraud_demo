"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length > 1) {
      map.fitBounds(points, { padding: [50, 50] });
    } else if (points.length === 1) {
      map.setView(points[0], 13);
    }
  }, [points, map]);

  return null;
}

function numberedImageIcon(num: number): L.Icon {
  return L.icon({
    iconUrl: `/marker-${num}.svg`,
    iconSize: [32, 45],
    iconAnchor: [16, 45],
    popupAnchor: [0, -40],
  });
}

export default function MapViewer({ tx1, tx2 }: { tx1: { lat: number; lon: number; ts: string | number }; tx2: { lat: number; lon: number; ts: string | number } }) {
  const positions: [number, number][] = [
    [tx1.lat, tx1.lon],
    [tx2.lat, tx2.lon],
  ];

  return (
    <MapContainer
      center={positions[0]}
      zoom={5}
      style={{ height: "400px", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds points={positions} />

      <Marker position={positions[0]} icon={numberedImageIcon(1)}>
        <Popup>
          <b>TX 1</b><br />{tx1.lat}, {tx1.lon}<br />{tx1.ts}
        </Popup>
      </Marker>

      <Marker position={positions[1]} icon={numberedImageIcon(2)}>
        <Popup>
          <b>TX 2</b><br />{tx2.lat}, {tx2.lon}<br />{tx2.ts}
        </Popup>
      </Marker>

      <Polyline positions={positions} color="#360061" />
    </MapContainer>
  );
}
