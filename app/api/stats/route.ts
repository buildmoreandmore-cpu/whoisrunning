import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET() {
  try {
    const { data: contributions, error } = await supabase
      .from("contributions")
      .select("amount, is_recurring")
      .eq("status", "active");

    if (error) {
      throw error;
    }

    const contributorCount = contributions?.length || 0;
    const totalRaised = contributions?.reduce((sum, c) => sum + Number(c.amount), 0) || 0;
    const averageContribution = contributorCount > 0 ? totalRaised / contributorCount : 0;

    return NextResponse.json({
      contributorCount,
      totalRaised,
      averageContribution,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { contributorCount: 0, totalRaised: 0, averageContribution: 0 },
      { status: 500 }
    );
  }
}
