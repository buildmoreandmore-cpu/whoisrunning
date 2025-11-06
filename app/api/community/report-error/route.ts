import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      candidateId,
      candidateName,
      errorType,
      description,
      email,
      source,
      timestamp,
    } = body;

    // Validate required fields
    if (!candidateId || !candidateName || !errorType || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Log the error report (in production, you'd save to database)
    console.log("Community Error Report:", {
      candidateId,
      candidateName,
      errorType,
      description,
      email: email || "anonymous",
      source: source || "none provided",
      timestamp,
      userAgent: request.headers.get("user-agent"),
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
    });

    // TODO: In production, implement:
    // 1. Save to database (Supabase/Postgres)
    // 2. Send notification to admin team
    // 3. Create review workflow
    // 4. Track community contribution stats
    // 5. Send confirmation email if provided

    // For now, we'll use a simple webhook or email notification
    // You can add your preferred notification service here

    // Example: Send to Discord webhook, Slack, or email service
    if (process.env.COMMUNITY_WEBHOOK_URL) {
      await fetch(process.env.COMMUNITY_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `📝 New Error Report\n**Candidate:** ${candidateName}\n**Type:** ${errorType}\n**Details:** ${description}\n**Source:** ${source || "Not provided"}\n**Email:** ${email || "Anonymous"}`,
        }),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Error report submitted successfully",
    });
  } catch (error) {
    console.error("Error processing error report:", error);
    return NextResponse.json(
      { error: "Failed to process report" },
      { status: 500 }
    );
  }
}
