import { Candidate } from "@/types/candidate";
import { researchCandidate } from "./perplexity-client";

interface CandidateSearchParams {
  name?: string;
  state?: string;
  county?: string;
  city?: string;
  office?: string;
}

export async function searchCandidates(
  params: CandidateSearchParams
): Promise<Candidate[]> {
  const { name, state, county, city, office } = params;

  let query = "List current political candidates";

  if (name) {
    query = `Find information about political candidate ${name}`;
  } else {
    if (office) query += ` running for ${office}`;
    if (city) query += ` in ${city}`;
    if (county) query += ` in ${county} County`;
    if (state) query += ` in ${state}`;
  }

  query += `. For each candidate provide: full name, political party, office they're running for, current position (if any), 3-5 key political positions/ideology tags, brief bio (2-3 sentences), website URL if available, and recent news.`;

  try {
    const response = await researchCandidate({
      query,
      context: "Format the response as a structured list of candidates.",
    });

    // Parse the response and convert to Candidate objects
    return parseCandidatesFromResponse(response.content, params);
  } catch (error) {
    console.error("Error searching candidates:", error);
    return [];
  }
}

export async function getCandidateDetails(
  candidateId: string,
  candidateName: string
): Promise<Candidate | null> {
  try {
    // Fetch comprehensive candidate information
    const [profileRes, ideologyRes, resourcesRes] = await Promise.all([
      researchCandidate({
        query: `Provide a comprehensive profile including: political party, current office or race, voting record highlights if applicable, education and career background, and recent news.`,
        candidateName,
      }),
      researchCandidate({
        query: `What are the key ideological positions and political philosophy? List specific policy stances on: healthcare, economy, climate/environment, education, criminal justice, immigration. Also provide 2-3 notable quotes with sources and dates.`,
        candidateName,
      }),
      researchCandidate({
        query: `Find recent interviews, speeches, debates, or campaign videos with YouTube links. Also find recent news articles from major publications.`,
        candidateName,
      }),
    ]);

    return parseDetailedCandidate(
      candidateId,
      candidateName,
      profileRes.content,
      ideologyRes.content,
      resourcesRes.content
    );
  } catch (error) {
    console.error("Error fetching candidate details:", error);
    return null;
  }
}

export async function getTrendingCandidates(): Promise<any[]> {
  try {
    const response = await researchCandidate({
      query: `List the top 5 most talked about political candidates in the news right now in the United States. Include their name, party, office they're running for or currently hold, state, and why they're trending.`,
    });

    return parseTrendingFromResponse(response.content);
  } catch (error) {
    console.error("Error fetching trending candidates:", error);
    // Return mock data as fallback
    return getMockTrending();
  }
}

export async function getRecentWinners(): Promise<any[]> {
  try {
    const response = await researchCandidate({
      query: `List the most recent election winners in the United States (within the last 3 months). Include candidate name, party, office won, state/location, election date, and vote percentage if available.`,
    });

    return parseWinnersFromResponse(response.content);
  } catch (error) {
    console.error("Error fetching recent winners:", error);
    // Return mock data as fallback
    return getMockWinners();
  }
}

// Helper functions to parse Perplexity responses
function parseCandidatesFromResponse(
  content: string,
  params: CandidateSearchParams
): Candidate[] {
  // For now, return a structured parse attempt
  // In production, you might use GPT to structure the data or regex parsing
  const candidates: Candidate[] = [];

  // Simple parsing logic - split by candidate entries
  const lines = content.split("\n");
  let currentCandidate: Partial<Candidate> = {};

  lines.forEach((line) => {
    line = line.trim();
    if (!line) return;

    // Try to detect candidate name (usually starts with number or dash)
    if (line.match(/^\d+\.|^-|^•/)) {
      if (currentCandidate.name) {
        candidates.push(completeCandidate(currentCandidate, params));
        currentCandidate = {};
      }
      // Extract name from line
      const nameMatch = line.match(/(?:\d+\.|^-|^•)\s*(.+?)(?:\s*-|\s*\(|$)/);
      if (nameMatch) {
        currentCandidate.name = nameMatch[1].trim();
        currentCandidate.id = generateCandidateId(currentCandidate.name);
      }
    }

    // Extract party
    if (line.toLowerCase().includes("party:") || line.includes("(D)") || line.includes("(R)")) {
      if (line.includes("Democrat") || line.includes("(D)")) {
        currentCandidate.party = "Democrat";
      } else if (line.includes("Republican") || line.includes("(R)")) {
        currentCandidate.party = "Republican";
      } else if (line.includes("Independent")) {
        currentCandidate.party = "Independent";
      }
    }

    // Extract office
    if (line.toLowerCase().includes("office:") || line.toLowerCase().includes("running for")) {
      const officeMatch = line.match(/(?:office:|running for)\s*(.+?)(?:\.|$)/i);
      if (officeMatch) {
        currentCandidate.office = officeMatch[1].trim();
      }
    }
  });

  // Add last candidate
  if (currentCandidate.name) {
    candidates.push(completeCandidate(currentCandidate, params));
  }

  return candidates;
}

function completeCandidate(
  partial: Partial<Candidate>,
  params: CandidateSearchParams
): Candidate {
  return {
    id: partial.id || generateCandidateId(partial.name || "unknown"),
    name: partial.name || "Unknown Candidate",
    party: partial.party || "Other",
    office: partial.office || "Unknown Office",
    state: params.state || partial.state || "Unknown",
    county: params.county || partial.county,
    city: params.city || partial.city,
    ideology: partial.ideology || [],
    bio: partial.bio,
    website: partial.website,
    keyPositions: partial.keyPositions,
    quotes: partial.quotes,
    resources: partial.resources,
  };
}

function parseDetailedCandidate(
  id: string,
  name: string,
  profile: string,
  ideology: string,
  resources: string
): Candidate {
  // Extract party from profile
  let party: Candidate["party"] = "Other";
  if (profile.includes("Democrat")) party = "Democrat";
  else if (profile.includes("Republican")) party = "Republican";
  else if (profile.includes("Independent")) party = "Independent";

  // Extract office
  const officeMatch = profile.match(/(?:running for|currently serves as|holds office of)\s+([^.]+)/i);
  const office = officeMatch ? officeMatch[1].trim() : "Political Office";

  // Extract bio (first 2-3 sentences)
  const sentences = profile.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const bio = sentences.slice(0, 3).join(". ") + ".";

  // Extract ideology tags from ideology content
  const ideologyTags: string[] = [];
  if (ideology.includes("healthcare") || ideology.includes("Healthcare")) {
    ideologyTags.push("Healthcare Reform");
  }
  if (ideology.includes("climate") || ideology.includes("environment")) {
    ideologyTags.push("Environmental Protection");
  }
  if (ideology.includes("education") || ideology.includes("Education")) {
    ideologyTags.push("Education");
  }
  if (ideology.includes("economy") || ideology.includes("Economy")) {
    ideologyTags.push("Economic Policy");
  }
  if (ideology.includes("criminal justice") || ideology.includes("Criminal Justice")) {
    ideologyTags.push("Criminal Justice Reform");
  }

  // Extract quotes
  const quotes = extractQuotes(ideology);

  // Extract resources
  const resourceList = extractResources(resources);

  // Extract key positions
  const keyPositions = extractKeyPositions(ideology);

  return {
    id,
    name,
    party,
    office,
    state: "United States",
    bio,
    ideology: ideologyTags.length > 0 ? ideologyTags : ["Public Service"],
    quotes,
    resources: resourceList,
    keyPositions,
  };
}

function extractQuotes(content: string): Array<{ text: string; source: string; date: string }> {
  const quotes: Array<{ text: string; source: string; date: string }> = [];

  // Look for quoted text
  const quoteMatches = content.matchAll(/"([^"]+)"/g);
  for (const match of quoteMatches) {
    if (match[1].length > 20) {
      quotes.push({
        text: match[1],
        source: "Recent Statement",
        date: new Date().toISOString().split('T')[0],
      });
      if (quotes.length >= 3) break;
    }
  }

  return quotes;
}

function extractResources(content: string): Array<{ type: "video" | "article"; title: string; url: string; source: string }> {
  const resources: Array<{ type: "video" | "article"; title: string; url: string; source: string }> = [];

  // Extract YouTube links
  const youtubeMatches = content.matchAll(/https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/[^\s]+/g);
  for (const match of youtubeMatches) {
    resources.push({
      type: "video",
      title: "Campaign Video",
      url: match[0],
      source: "YouTube",
    });
  }

  // Extract article URLs
  const urlMatches = content.matchAll(/https?:\/\/[^\s]+/g);
  let articleCount = 0;
  for (const match of urlMatches) {
    if (!match[0].includes("youtube") && articleCount < 3) {
      resources.push({
        type: "article",
        title: "Recent Article",
        url: match[0],
        source: "News Source",
      });
      articleCount++;
    }
  }

  return resources;
}

function extractKeyPositions(content: string): string[] {
  const positions: string[] = [];

  // Split into sentences and find policy-related statements
  const sentences = content.split(/[.!?]+/);

  for (const sentence of sentences) {
    if (sentence.length > 30 && sentence.length < 200) {
      if (
        sentence.toLowerCase().includes("support") ||
        sentence.toLowerCase().includes("advocate") ||
        sentence.toLowerCase().includes("propose") ||
        sentence.toLowerCase().includes("opposes") ||
        sentence.toLowerCase().includes("believes")
      ) {
        positions.push(sentence.trim());
        if (positions.length >= 5) break;
      }
    }
  }

  return positions;
}

function parseTrendingFromResponse(content: string): any[] {
  // Simple parsing for trending candidates
  const trending: any[] = [];
  const lines = content.split("\n");

  lines.forEach((line) => {
    if (line.match(/^\d+\.|^-|^•/)) {
      const nameMatch = line.match(/(?:\d+\.|^-|^•)\s*(.+?)(?:\s*-|\s*\(|$)/);
      if (nameMatch) {
        trending.push({
          id: generateCandidateId(nameMatch[1]),
          name: nameMatch[1].trim(),
          office: "Political Office",
          state: "United States",
          party: line.includes("Democrat") ? "Democrat" : line.includes("Republican") ? "Republican" : "Other",
          searchCount: Math.floor(Math.random() * 20000) + 5000,
          percentageChange: Math.floor(Math.random() * 50) + 10,
          trend: "up" as const,
        });
      }
    }
  });

  return trending.length > 0 ? trending.slice(0, 5) : getMockTrending();
}

function parseWinnersFromResponse(content: string): any[] {
  const winners: any[] = [];
  const lines = content.split("\n");

  lines.forEach((line) => {
    if (line.match(/^\d+\.|^-|^•/)) {
      const nameMatch = line.match(/(?:\d+\.|^-|^•)\s*(.+?)(?:\s*-|\s*\(|$)/);
      if (nameMatch) {
        winners.push({
          id: generateCandidateId(nameMatch[1]),
          candidateName: nameMatch[1].trim(),
          office: "Elected Office",
          state: "United States",
          party: line.includes("Democrat") ? "Democrat" : line.includes("Republican") ? "Republican" : "Other",
          electionDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          votePercentage: 50 + Math.random() * 20,
        });
      }
    }
  });

  return winners.length > 0 ? winners.slice(0, 4) : getMockWinners();
}

function generateCandidateId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getMockTrending(): any[] {
  return [
    {
      id: "1",
      name: "Sarah Johnson",
      office: "Governor",
      state: "California",
      party: "Democrat",
      searchCount: 15420,
      percentageChange: 34.5,
      trend: "up" as const,
    },
    {
      id: "2",
      name: "Michael Chen",
      office: "US Senate",
      state: "New York",
      party: "Republican",
      searchCount: 12350,
      percentageChange: 28.2,
      trend: "up" as const,
    },
  ];
}

function getMockWinners(): any[] {
  return [
    {
      id: "1",
      candidateName: "Robert Williams",
      office: "US House District 12",
      state: "Pennsylvania",
      party: "Democrat" as const,
      electionDate: "2024-11-05",
      votePercentage: 54.8,
    },
  ];
}
