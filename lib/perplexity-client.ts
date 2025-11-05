export interface ResearchRequest {
  query: string;
  candidateName?: string;
  context?: string;
}

export interface Citation {
  title: string;
  url: string;
}

export interface ResearchResponse {
  content: string;
  citations: Citation[];
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// In-memory cache with TTL
const cache = new Map<string, { data: ResearchResponse; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

export async function researchCandidate(
  request: ResearchRequest
): Promise<ResearchResponse> {
  // Generate cache key
  const cacheKey = JSON.stringify(request);

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log("Returning cached result for:", request.query);
    return cached.data;
  }

  // Make API request
  const response = await fetch("/api/perplexity/research", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Research failed");
  }

  const data = await response.json();

  // Cache the result
  cache.set(cacheKey, { data, timestamp: Date.now() });

  return data;
}

export async function getCandidateProfile(candidateName: string) {
  return researchCandidate({
    query: `Provide a comprehensive profile including: political party, current office or race, key political positions, voting record highlights, recent news, and notable quotes.`,
    candidateName,
  });
}

export async function getCandidateIdeology(candidateName: string) {
  return researchCandidate({
    query: `What are the key ideological positions and political philosophy? Include specific policy stances on major issues.`,
    candidateName,
  });
}

export async function getCandidateResources(candidateName: string) {
  return researchCandidate({
    query: `Find recent interviews, speeches, debates, or campaign videos. Include YouTube links and major news articles.`,
    candidateName,
  });
}

export async function searchCandidatesByLocation(
  state: string,
  office?: string
) {
  return researchCandidate({
    query: `List current candidates running for ${office || "office"} in ${state}. Include their party affiliation and brief background.`,
  });
}
