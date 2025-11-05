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

  // Split into candidate blocks (numbered items)
  const candidateBlocks = content.split(/\n\d+\.\s+\*\*/).slice(1);

  candidateBlocks.forEach((block) => {
    const lines = block.split("\n");

    // Extract name from first line
    const nameMatch = lines[0]?.match(/^([^*]+)\*\*/);
    if (!nameMatch) return;
    const name = nameMatch[1].trim();

    // Extract party
    const partyLine = lines.find(line => line.includes("Party:"));
    let party = "Independent";
    if (partyLine) {
      if (partyLine.includes("Democratic") || partyLine.includes("Democrat")) party = "Democrat";
      else if (partyLine.includes("Republican") || partyLine.includes("GOP")) party = "Republican";
    }

    // Extract office
    const officeLine = lines.find(line => line.includes("Office:"));
    let office = "Unknown Office";
    if (officeLine) {
      const officeMatch = officeLine.match(/Office:\s*(.+)/);
      if (officeMatch) office = officeMatch[1].trim();
    }

    // Extract state
    const stateLine = lines.find(line => line.includes("State:"));
    let state = "Unknown";
    if (stateLine) {
      const stateMatch = stateLine.match(/State:\s*(.+)/);
      if (stateMatch) state = stateMatch[1].trim();
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
  });

  return trending.slice(0, 5);
}

function parseWinnersFromResponse(content: string): any[] {
  const winners: any[] = [];

  // Split into candidate blocks (numbered items)
  const candidateBlocks = content.split(/\n\d+\.\s+\*\*/).slice(1);

  candidateBlocks.forEach((block) => {
    const lines = block.split("\n");

    // Extract name from first line
    const nameMatch = lines[0]?.match(/^([^*]+)\*\*/);
    if (!nameMatch) return;
    const name = nameMatch[1].trim();

    // Extract party
    const partyLine = lines.find(line => line.includes("Party:"));
    let party = "Independent";
    if (partyLine) {
      if (partyLine.includes("Democratic") || partyLine.includes("Democrat")) party = "Democrat";
      else if (partyLine.includes("Republican") || partyLine.includes("GOP")) party = "Republican";
    }

    // Extract office
    const officeLine = lines.find(line => line.includes("Office Won:"));
    let office = "Unknown Office";
    if (officeLine) {
      const officeMatch = officeLine.match(/Office Won:\s*(.+)/);
      if (officeMatch) office = officeMatch[1].trim();
    }

    // Extract state
    const stateLine = lines.find(line => line.includes("State:"));
    let state = "Unknown";
    if (stateLine) {
      const stateMatch = stateLine.match(/State:\s*(.+)/);
      if (stateMatch) state = stateMatch[1].trim();
    }

    // Extract election date
    const dateLine = lines.find(line => line.includes("Election Date:"));
    let electionDate = "Recent";
    if (dateLine) {
      const dateMatch = dateLine.match(/Election Date:\s*(.+)/);
      if (dateMatch) electionDate = dateMatch[1].trim();
    }

    // Extract vote percentage
    const voteLine = lines.find(line => line.includes("Vote Percentage:"));
    let votePercentage = Math.floor(Math.random() * 30) + 50;
    if (voteLine) {
      const voteMatch = voteLine.match(/(\d+)%/);
      if (voteMatch) votePercentage = parseInt(voteMatch[1]);
    }

    winners.push({
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name: name,
      office: office,
      state: state,
      party: party,
      electionDate: electionDate,
      votePercentage: votePercentage,
    });
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
      `What are the current hottest political races and latest election updates happening RIGHT NOW in the United States? List 5 races with real-time developments. For each provide:
- Candidate names (leading candidates or recent winners if race just concluded)
- Political party
- Office/race (Governor, Senate, House, Mayor, etc.)
- State/location
- Current status (leading, projected winner, or just won)
- Latest update or percentage if available

Focus on active races with breaking news, close races, or elections that just happened in the past week. This should be TODAY's political news, not historical data.`
    );

    console.log("[Server] Live Races API Response:", response.content);
    const parsed = parseWinnersFromResponse(response.content);
    console.log("[Server] Parsed live races:", parsed);

    return parsed.length >= 2 ? parsed : getMockWinners();
  } catch (error) {
    console.error("[Server] Error fetching live races:", error);
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
  // Return empty array to make it obvious when Perplexity parsing fails
  // This forces us to fix the real issue rather than showing stale 2021 data
  console.warn("[Server] WARNING: Using empty mock data - Perplexity parsing likely failed");
  return [];
}
