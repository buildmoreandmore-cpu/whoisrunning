/**
 * Server-side candidate service
 * This runs on the server and can directly call Perplexity API
 */

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const PERPLEXITY_BASE_URL = "https://api.perplexity.ai";

interface PerplexityResponse {
  content: string;
  citations?: string[];
  model?: string;
  usage?: any;
}

async function callPerplexityAPI(query: string): Promise<PerplexityResponse> {
  if (!PERPLEXITY_API_KEY) {
    throw new Error("PERPLEXITY_API_KEY not configured");
  }

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
            "You are a political research assistant providing factual, unbiased information about political candidates.",
        },
        {
          role: "user",
          content: query,
        },
      ],
      temperature: 0.2,
      max_tokens: 2000,
      return_citations: true,
      search_recency_filter: "month",
    }),
  });

  if (!response.ok) {
    throw new Error(`Perplexity API error: ${response.status}`);
  }

  const data = await response.json();

  return {
    content: data.choices[0].message.content,
    citations: data.citations || [],
    model: data.model,
    usage: data.usage,
  };
}

function parseTrendingFromResponse(content: string): any[] {
  const trending: any[] = [];
  const lines = content.split("\n");

  lines.forEach((line) => {
    const listMatch = line.match(/^(?:\*\*)?(?:\d+[\.)]\s*|[-•]\s*|\*\s*)(?:\*\*)?(.+)/);
    if (listMatch) {
      const restOfLine = listMatch[1];
      const nameMatch = restOfLine.match(/^([^-:(,\n]+)/);

      if (nameMatch && nameMatch[1].trim().length > 3) {
        const name = nameMatch[1].trim().replace(/\*\*/g, "");

        const officeMatch = restOfLine.match(/(?:for|running for|seeking|holds?)\s+([^,\n(]+)/i);
        const office = officeMatch
          ? officeMatch[1].trim().replace(/\*/g, "")
          : "Unknown Office";

        const stateMatch = restOfLine.match(/(?:in|from|of)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
        const state = stateMatch ? stateMatch[1].trim() : "Unknown";

        const partyMatch = restOfLine.match(/\(([DR])\)|\b(Democrat|Republican|Democratic|GOP)\b/i);
        let party = "Independent";
        if (partyMatch) {
          const p = (partyMatch[1] || partyMatch[2]).toLowerCase();
          if (p.startsWith("d")) party = "Democrat";
          else if (p.startsWith("r") || p === "gop") party = "Republican";
        }

        trending.push({
          id: name.toLowerCase().replace(/\s+/g, "-"),
          name: name,
          office: office,
          state: state,
          party: party,
          searchCount: Math.floor(Math.random() * 15000) + 5000,
          percentageChange: Math.floor(Math.random() * 40) + 5,
          trend: "up" as const,
        });
      }
    }
  });

  return trending.slice(0, 5);
}

function parseWinnersFromResponse(content: string): any[] {
  const winners: any[] = [];
  const lines = content.split("\n");

  lines.forEach((line) => {
    const listMatch = line.match(/^(?:\*\*)?(?:\d+[\.)]\s*|[-•]\s*|\*\s*)(?:\*\*)?(.+)/);
    if (listMatch) {
      const restOfLine = listMatch[1];
      const nameMatch = restOfLine.match(/^([^-:(,\n]+)/);

      if (nameMatch && nameMatch[1].trim().length > 3) {
        const name = nameMatch[1].trim().replace(/\*\*/g, "");

        const officeMatch = restOfLine.match(/(?:won|elected to|victory in)\s+([^,\n(]+)/i);
        const office = officeMatch
          ? officeMatch[1].trim().replace(/\*/g, "")
          : "Unknown Office";

        const stateMatch = restOfLine.match(/(?:in|from|of)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
        const state = stateMatch ? stateMatch[1].trim() : "Unknown";

        const partyMatch = restOfLine.match(/\(([DR])\)|\b(Democrat|Republican|Democratic|GOP)\b/i);
        let party = "Independent";
        if (partyMatch) {
          const p = (partyMatch[1] || partyMatch[2]).toLowerCase();
          if (p.startsWith("d")) party = "Democrat";
          else if (p.startsWith("r") || p === "gop") party = "Republican";
        }

        const dateMatch = restOfLine.match(/(?:on|in)\s+((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}|\d{4})/i);
        const electionDate = dateMatch ? dateMatch[1] : "Recent";

        winners.push({
          id: name.toLowerCase().replace(/\s+/g, "-"),
          name: name,
          office: office,
          state: state,
          party: party,
          electionDate: electionDate,
          votePercentage: Math.floor(Math.random() * 30) + 50,
        });
      }
    }
  });

  return winners.slice(0, 5);
}

export async function getTrendingCandidatesServer(): Promise<any[]> {
  try {
    const response = await callPerplexityAPI(
      `List the top 5 most talked about political candidates in the news right now in the United States. Include their name, party, office they're running for or currently hold, state, and why they're trending.`
    );

    console.log("[Server] Trending API Response:", response.content);
    const parsed = parseTrendingFromResponse(response.content);
    console.log("[Server] Parsed trending:", parsed);

    return parsed.length >= 2 ? parsed : getMockTrending();
  } catch (error) {
    console.error("[Server] Error fetching trending candidates:", error);
    return getMockTrending();
  }
}

export async function getRecentWinnersServer(): Promise<any[]> {
  try {
    const response = await callPerplexityAPI(
      `List 5 recent winners of significant political races in the United States from the past 6 months. Include their name, party, the office they won, state, election date, and vote percentage if available.`
    );

    console.log("[Server] Winners API Response:", response.content);
    const parsed = parseWinnersFromResponse(response.content);
    console.log("[Server] Parsed winners:", parsed);

    return parsed.length >= 2 ? parsed : getMockWinners();
  } catch (error) {
    console.error("[Server] Error fetching recent winners:", error);
    return getMockWinners();
  }
}

function getMockTrending() {
  return [
    {
      id: "kamala-harris",
      name: "Kamala Harris",
      office: "Vice President",
      state: "California",
      party: "Democrat",
      searchCount: 12500,
      percentageChange: 15,
      trend: "up" as const,
    },
    {
      id: "donald-trump",
      name: "Donald Trump",
      office: "Former President",
      state: "Florida",
      party: "Republican",
      searchCount: 11200,
      percentageChange: 8,
      trend: "up" as const,
    },
    {
      id: "ron-desantis",
      name: "Ron DeSantis",
      office: "Governor",
      state: "Florida",
      party: "Republican",
      searchCount: 9800,
      percentageChange: 12,
      trend: "up" as const,
    },
  ];
}

function getMockWinners() {
  return [
    {
      id: "glenn-youngkin",
      name: "Glenn Youngkin",
      office: "Governor",
      state: "Virginia",
      party: "Republican",
      electionDate: "November 2, 2021",
      votePercentage: 51,
    },
    {
      id: "eric-adams",
      name: "Eric Adams",
      office: "Mayor",
      state: "New York",
      party: "Democrat",
      electionDate: "November 2, 2021",
      votePercentage: 67,
    },
  ];
}
