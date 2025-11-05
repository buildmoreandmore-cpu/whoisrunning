import { NextResponse } from "next/server";

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const PERPLEXITY_BASE_URL = "https://api.perplexity.ai";

export async function GET() {
  try {
    if (!PERPLEXITY_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured", hasKey: false },
        { status: 500 }
      );
    }

    // Test API call
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
            content: "You are a helpful assistant.",
          },
          {
            role: "user",
            content: "Who is the current President of the United States? Just say their name.",
          },
        ],
        temperature: 0.2,
        max_tokens: 100,
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      hasKey: true,
      keyLength: PERPLEXITY_API_KEY.length,
      response: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Test failed",
        message: error.message,
        hasKey: !!PERPLEXITY_API_KEY,
      },
      { status: 500 }
    );
  }
}
