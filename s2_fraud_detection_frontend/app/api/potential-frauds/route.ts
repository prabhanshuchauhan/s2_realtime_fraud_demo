import { query } from '@/lib/query';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 20;
  const offset = (page - 1) * limit;

  const sql = `
    SELECT pf.fraud_id, pf.distance_km, pf.speed_kmh, t2.ts, u.username
    FROM potential_fraud pf
    JOIN transactions t2 ON pf.tx_id2 = t2.tx_id
    JOIN users u ON pf.user_id = u.user_id
    ORDER BY t2.ts DESC
    LIMIT ${limit} OFFSET ${offset};
  `;

  const countSql = 'SELECT COUNT(*) AS total FROM potential_fraud';

  const [results, countResult] = await Promise.all([
    query(sql),
    query(countSql)
  ]);

  const countRow = countResult[0] as { total: number } | undefined;
  const total = countRow?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({
    frauds: results,
    total,
    page,
    totalPages
  });
}