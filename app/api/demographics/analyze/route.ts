import { NextRequest, NextResponse } from "next/server";
import { DemographicProfile, ImpactAnalysisResult } from "@/types/demographics";
import {
  buildAnalysisPrompt,
  parseImpactsFromResponse,
  generateSummary,
} from "@/lib/demographics-utils";

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const PERPLEXITY_BASE_URL = "https://api.perplexity.ai";

const SYSTEM_PROMPT = `You are a policy analysis assistant that provides factual, unbiased information about how local and state policies affect different demographic groups. Focus on objective policy impacts without political bias. Always cite sources when possible. Structure your response with clear category headers and specific impacts.`;

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
    const { demographics } = body as { demographics: DemographicProfile };

    // Validate request
    if (!demographics) {
      return NextResponse.json(
        { error: "Demographics data required" },
        { status: 400 }
      );
    }

    if (!demographics.location?.state) {
      return NextResponse.json(
        { error: "Location (at least state) is required" },
        { status: 400 }
      );
    }

    // Build the analysis prompt
    const userPrompt = buildAnalysisPrompt(demographics);

    console.log("Analyzing demographics:", {
      age: demographics.ageRange,
      income: demographics.incomeRange,
      location: demographics.location.state,
    });

    // Call Perplexity API
    const response = await fetch(`${PERPLEXITY_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 2500,
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
    const content = data.choices[0].message.content;

    console.log("Perplexity response received, parsing impacts...");
    console.log("Raw citations from Perplexity:", JSON.stringify(data.citations));

    // Parse impacts from response
    const impacts = parseImpactsFromResponse(content);

    console.log(`Parsed ${impacts.length} impacts`);

    // Generate summary
    const summary = generateSummary(demographics, impacts);

    // Transform Perplexity citations to our Citation format
    const citations = (data.citations || []).map((citation: any) => ({
      url: citation.url || citation,
      title: citation.title || citation.text || citation.url || citation,
      source: citation.source || undefined,
    }));

    console.log("Transformed citations:", JSON.stringify(citations));

    // Build result
    const result: ImpactAnalysisResult = {
      demographics,
      impacts,
      summary,
      citations,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Demographic analysis error:", error);
    return NextResponse.json(
      { error: "Internal server error during analysis" },
      { status: 500 }
    );
  }
}
