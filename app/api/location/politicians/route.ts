import { NextRequest, NextResponse } from "next/server";

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const PERPLEXITY_BASE_URL = "https://api.perplexity.ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { location } = body;

    if (!location) {
      return NextResponse.json(
        { error: "Location is required" },
        { status: 400 }
      );
    }

    if (!PERPLEXITY_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Query Perplexity for politicians in this location
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
            content:
              "You are a political research assistant providing factual information about current elected officials.",
          },
          {
            role: "user",
            content: `List ALL current elected officials serving in ${location}. Include:
- U.S. Senators (if state level)
- U.S. House Representatives (district specific)
- Governor (if state level)
- State Senators and Representatives (if city/county provided)
- Mayor (if city provided)
- County Commissioners or Board Members (if county provided)
- City Council members (if city provided)

For each official, provide this exact format:
**[Full Name]** - [Office/Title] - Party: [Democrat/Republican/Independent]

Example:
**John Smith** - U.S. Senator - Party: Democrat
**Jane Doe** - Governor - Party: Republican

IMPORTANT: Always include the party affiliation in the format "Party: [Democrat/Republican/Independent]" even if the official is well-known. Focus on currently serving officials, not candidates.`,
          },
        ],
        temperature: 0.2,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      console.error("Perplexity API error:", response.status);
      return NextResponse.json(
        { error: "Failed to fetch politicians" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    console.log(`[Politicians API] Location: ${location}`);
    console.log(`[Politicians API] Response:`, content);

    // Parse the response
    const politicians = parsePoliticians(content);

    return NextResponse.json({
      location,
      politicians,
      count: politicians.length,
    });
  } catch (error: any) {
    console.error("Error in politicians API:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

function parsePoliticians(content: string): Array<{
  id: string;
  name: string;
  office: string;
  party: string;
}> {
  const politicians: Array<{
    id: string;
    name: string;
    office: string;
    party: string;
  }> = [];

  // Split by numbered items
  const lines = content.split("\n");

  lines.forEach((line) => {
    // Match numbered list items
    const match = line.match(/^\d+\.\s*\*\*(.+?)\*\*/);
    if (!match) return;

    const restOfLine = line;
    const nameMatch = restOfLine.match(/\*\*(.+?)\*\*/);
    if (!nameMatch) return;

    const name = nameMatch[1].trim();

    // Extract office
    const officeMatch = restOfLine.match(/(?:Office|Title|Position):\s*\*?\*?([^*\n]+)/i) ||
                       restOfLine.match(/[-–]\s*([^(]+?)(?:\(|$)/);
    const office = officeMatch
      ? officeMatch[1].trim().replace(/[*]/g, "")
      : "Elected Official";

    // Extract party - improved regex to catch more variations
    let party = "Unknown";

    // Try multiple patterns to find party affiliation
    const partyPatterns = [
      /Party:\s*\*?\*?([^*\n,]+)/i,                           // "Party: Democrat"
      /\(([DR])\)/,                                            // "(D)" or "(R)"
      /\b(Democrat|Republican|Democratic|Independent|GOP)\b/i, // Word match
      /-\s*(Democrat|Republican|Democratic|Independent)/i,     // "- Democrat"
      /\*\*Party\*\*:\s*([^*\n,]+)/i,                         // "**Party**: Democrat"
      /Political\s+Party:\s*([^*\n,]+)/i,                     // "Political Party: Democrat"
    ];

    for (const pattern of partyPatterns) {
      const match = restOfLine.match(pattern);
      if (match) {
        const p = match[1].toLowerCase().trim();
        if (p.includes("demo") || p === "d") {
          party = "Democrat";
          break;
        } else if (p.includes("rep") || p === "r" || p.includes("gop")) {
          party = "Republican";
          break;
        } else if (p.includes("ind")) {
          party = "Independent";
          break;
        }
      }
    }

    politicians.push({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name,
      office,
      party,
    });
  });

  console.log(`[Politicians API] Parsed ${politicians.length} politicians`);
  return politicians;
}
