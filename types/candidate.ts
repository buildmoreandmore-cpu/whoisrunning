export interface Candidate {
  id: string;
  name: string;
  party: "Democrat" | "Republican" | "Independent" | "Libertarian" | "Green" | "Other";
  office: string;
  state: string;
  county?: string;
  city?: string;
  ideology: string[];
  photo?: string;
  bio?: string;
  website?: string;
  socialMedia?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  keyPositions?: string[];
  quotes?: Array<{
    text: string;
    source: string;
    date: string;
  }>;
  resources?: Array<{
    type: "video" | "article" | "document";
    title: string;
    url: string;
    source: string;
  }>;
  votingRecord?: Array<{
    bill: string;
    vote: "Yes" | "No" | "Abstain";
    date: string;
  }>;
}

export interface CandidateSearchResult {
  candidate: Candidate;
  relevanceScore: number;
}

export type PartyColor = {
  [key in Candidate["party"]]: string;
};

export const PARTY_COLORS: PartyColor = {
  Democrat: "bg-blue-500",
  Republican: "bg-red-500",
  Independent: "bg-purple-500",
  Libertarian: "bg-yellow-500",
  Green: "bg-green-500",
  Other: "bg-gray-500",
};
