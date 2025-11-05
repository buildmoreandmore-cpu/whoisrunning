export interface TrendingCandidate {
  candidateId: string;
  candidateName: string;
  party: string;
  office: string;
  state: string;
  searchCount: number;
  percentageChange: number;
  trendDirection: "up" | "down" | "stable";
}

export interface RecentWinner {
  candidateId: string;
  candidateName: string;
  party: string;
  office: string;
  state: string;
  county?: string;
  city?: string;
  electionDate: string;
  votePercentage: number;
}

export interface AnalyticsEvent {
  eventType: "view" | "search" | "filter";
  candidateId?: string;
  location?: {
    state?: string;
    county?: string;
    city?: string;
  };
  timestamp: Date;
}
