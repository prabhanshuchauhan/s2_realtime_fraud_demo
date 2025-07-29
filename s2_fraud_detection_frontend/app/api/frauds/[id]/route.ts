import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/query';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const sql = `
    SELECT
      pf.fraud_id,
      u.username,
      pf.distance_km,
      pf.secs,
      pf.speed_kmh,
      t1.ts AS ts1,
      t1.lat AS lat1,
      t1.lon AS lon1,
      t2.ts AS ts2,
      t2.lat AS lat2,
      t2.lon AS lon2
    FROM potential_fraud pf
    JOIN transactions t1 ON pf.tx_id1 = t1.tx_id
    JOIN transactions t2 ON pf.tx_id2 = t2.tx_id
    JOIN users u ON pf.user_id = u.user_id
    JOIN users u1 ON t1.user_id = u1.user_id
    JOIN users u2 ON t2.user_id = u2.user_id
    WHERE pf.fraud_id = ?
    LIMIT 1;
  `;

  const results = await query(sql, [id]);

  if (results.length === 0) {
    return NextResponse.json({ error: 'Fraud not found' }, { status: 404 });
  }

  const r = results[0] as {
    fraud_id: number;
    username: string;
    distance_km: number;
    secs: number;
    speed_kmh: number;
    ts1: string | number;
    lat1: number;
    lon1: number;
    ts2: string | number;
    lat2: number;
    lon2: number;
  };

  return NextResponse.json({
    fraud_id: r.fraud_id,
    username: r.username,
    distance_km: r.distance_km,
    secs: r.secs,
    speed_kmh: r.speed_kmh,
    tx1: {
      ts: r.ts1,
      lat: r.lat1,
      lon: r.lon1,
    },
    tx2: {
      ts: r.ts2,
      lat: r.lat2,
      lon: r.lon2,
    },
  });
}
