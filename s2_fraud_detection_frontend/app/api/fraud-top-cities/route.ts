import { NextResponse } from "next/server";
import { query } from "@/lib/query";

export async function GET() {
  const sql = `
    SELECT u.city, u.country, COUNT(*) AS fraud_count
    FROM potential_fraud pf
    JOIN users u ON pf.user_id = u.user_id
    GROUP BY u.city, u.country
    ORDER BY fraud_count DESC
    LIMIT 10;
  `;

  const rows = await query(sql);

  return NextResponse.json({ cities: rows });
}
