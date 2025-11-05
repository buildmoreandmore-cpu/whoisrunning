import { NextRequest, NextResponse } from "next/server";

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const PERPLEXITY_BASE_URL = "https://api.perplexity.ai";

export async function POST(request: NextRequest) {
  try {
    // Validate API key exists
    if (!PERPLEXITY_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { query, candidateName, context } = body;

    // Validate request
    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Invalid query parameter" },
        { status: 400 }
      );
    }

    // Build the research prompt
    const systemPrompt = `You are a political research assistant that provides factual, unbiased information about political candidates. Always cite sources and provide balanced perspectives. Focus on:
- Political positions and ideology
- Voting record (if applicable)
- Public statements and quotes
- Campaign promises and platform
- Background and experience
- Recent news and developments

Return information in a structured format with clear bullet points.`;

    const userPrompt = candidateName
      ? `Research ${candidateName} - ${query}${context ? `\n\nContext: ${context}` : ""}`
      : query;

    // Call Perplexity API
    const response = await fetch(`${PERPLEXITY_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-large-128k-online",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 2000,
        return_citations: true,
        search_recency_filter: "month",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Perplexity API error:", error);
      return NextResponse.json(
        { error: "Failed to fetch from Perplexity API" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      content: data.choices[0].message.content,
      citations: data.citations || [],
      model: data.model,
      usage: data.usage,
    });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
