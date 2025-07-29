import { NextResponse } from "next/server";
import { query } from "@/lib/query";

export async function GET() {
  const sql = `
    SELECT
      DATE(t2.ts) AS fraud_date,
      COUNT(*) AS fraud_count
    FROM potential_fraud pf
    JOIN transactions t2 ON pf.tx_id2 = t2.tx_id
    GROUP BY fraud_date
    ORDER BY fraud_date ASC;
  `;

  const rows = await query(sql);

  return NextResponse.json({ series: rows });
}
