// app/api/stats/route.ts
import { query } from '@/lib/query';
import { NextResponse } from 'next/server';

export async function GET() {
  const [totalTx] = await query('SELECT COUNT(*) AS total FROM transactions');
  const [totalFraud] = await query('SELECT COUNT(*) AS total FROM potential_fraud');
  const [lastUpdate] = await query('SELECT MAX(ts) AS last FROM transactions');

  const totalTxRow = totalTx as { total: number } | undefined;
  const totalFraudRow = totalFraud as { total: number } | undefined;
  const lastUpdateRow = lastUpdate as { last: string | number } | undefined;

  return NextResponse.json({
    total_transactions: totalTxRow?.total,
    total_frauds: totalFraudRow?.total,
    last_updated: lastUpdateRow?.last,
  });
}
