"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

// Mock data for trending candidates
const mockTrending = [
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
  {
    id: "3",
    name: "Jennifer Martinez",
    office: "US House",
    state: "Texas",
    party: "Democrat",
    searchCount: 9870,
    percentageChange: -5.3,
    trend: "down" as const,
  },
  {
    id: "4",
    name: "David Thompson",
    office: "Mayor",
    state: "Florida",
    party: "Independent",
    searchCount: 8420,
    percentageChange: 0.2,
    trend: "stable" as const,
  },
];

export function TrendingCandidates() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Trending Candidates
        </CardTitle>
        <CardDescription>Most searched candidates this week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTrending.map((candidate, index) => (
            <div
              key={candidate.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                  {index + 1}
                </div>
                <div>
                  <div className="font-semibold">{candidate.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {candidate.office} • {candidate.state}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {candidate.searchCount.toLocaleString()} views
                </Badge>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    candidate.trend === "up"
                      ? "text-green-600"
                      : candidate.trend === "down"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {candidate.trend === "up" && <TrendingUp className="h-4 w-4" />}
                  {candidate.trend === "down" && <TrendingDown className="h-4 w-4" />}
                  {candidate.trend === "stable" && <Minus className="h-4 w-4" />}
                  {Math.abs(candidate.percentageChange)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
