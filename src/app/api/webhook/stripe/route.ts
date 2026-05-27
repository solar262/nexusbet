import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    ok: true,
    message: "Stripe webhook is not configured yet. MarketVibe AI currently uses Stripe Payment Links.",
  });
}
