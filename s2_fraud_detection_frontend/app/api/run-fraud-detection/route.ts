import { NextResponse } from "next/server";
import { query } from "@/lib/query";

export async function POST() {
  try {
    await query("CALL atm_fraud()");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error running fraud detection:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
