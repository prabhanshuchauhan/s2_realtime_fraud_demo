import { NextResponse } from 'next/server';
import { query } from '@/lib/query';

export async function GET() {
  const totalSql = `SELECT COUNT(*) AS total FROM potential_fraud;`;
  const citySql = `
    SELECT city, COUNT(*) AS count FROM potential_fraud pf
    JOIN users u ON pf.user_id = u.user_id
    GROUP BY city ORDER BY count DESC LIMIT 1;
  `;
  const hourSql = `
    SELECT HOUR(t2.ts) AS hour, COUNT(*) AS count FROM potential_fraud pf
    JOIN transactions t2 ON pf.tx_id2 = t2.tx_id
    GROUP BY hour ORDER BY count DESC LIMIT 1;
  `;

  const totalRes = await query(totalSql);
  const topCityRes = await query(citySql);
  const peakHourRes = await query(hourSql);

  const totalRow = totalRes[0] as { total: number } | undefined;
  const topCityRow = topCityRes[0] as { city: string } | undefined;
  const peakHourRow = peakHourRes[0] as { hour: number } | undefined;

  return NextResponse.json({
    total: totalRow?.total || 0,
    topCity: topCityRow?.city || '-',
    peakHour: peakHourRow?.hour !== undefined ? `${peakHourRow.hour}:00` : '-',
  });
}