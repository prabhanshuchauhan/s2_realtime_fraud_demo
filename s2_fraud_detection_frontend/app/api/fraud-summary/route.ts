import { NextResponse } from "next/server";
import { query } from "@/lib/query";

export async function GET() {
  const sql = `
    SELECT
      COUNT(*) AS total_frauds,
      AVG(distance_km) AS avg_distance_km,
      AVG(speed_kmh) AS avg_speed_kmh,
      MAX(t2.ts) AS latest_fraud_time
    FROM potential_fraud pf
    JOIN transactions t2 ON pf.tx_id2 = t2.tx_id;
  `;

  const [row] = await query(sql);
  const result = row as {
    total_frauds: number;
    avg_distance_km: number;
    avg_speed_kmh: number;
    latest_fraud_time: string | number;
  } | undefined;

  return NextResponse.json({
    total_frauds: result?.total_frauds,
    avg_distance_km: result?.avg_distance_km,
    avg_speed_kmh: result?.avg_speed_kmh,
    latest_fraud_time: result?.latest_fraud_time,
  });
}
