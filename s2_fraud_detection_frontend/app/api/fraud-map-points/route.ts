import { query } from '@/lib/query';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const seconds = parseInt(searchParams.get("seconds") || "60");

  const sql = `
    SELECT t2.lat, t2.lon, u.username, t2.ts
    FROM potential_fraud pf
    JOIN transactions t2 ON pf.tx_id2 = t2.tx_id
    JOIN users u ON pf.user_id = u.user_id
    ORDER BY t2.ts DESC
    LIMIT 200;
  `;

  const results = await query(sql, [seconds]);

  return NextResponse.json({ points: results });
}