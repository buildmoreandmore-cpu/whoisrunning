"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar } from "lucide-react";
import { PARTY_COLORS } from "@/types/candidate";

// Mock data for recent winners
const mockWinners = [
  {
    id: "1",
    name: "Robert Williams",
    office: "US House District 12",
    state: "Pennsylvania",
    party: "Democrat" as const,
    electionDate: "2024-11-05",
    votePercentage: 54.8,
  },
  {
    id: "2",
    name: "Amanda Davis",
    office: "State Senate",
    state: "Georgia",
    party: "Republican" as const,
    electionDate: "2024-11-05",
    votePercentage: 51.2,
  },
  {
    id: "3",
    name: "Carlos Rodriguez",
    office: "Mayor",
    state: "Arizona",
    party: "Independent" as const,
    electionDate: "2024-11-05",
    votePercentage: 48.9,
  },
  {
    id: "4",
    name: "Lisa Anderson",
    office: "County Commissioner",
    state: "Michigan",
    party: "Democrat" as const,
    electionDate: "2024-11-05",
    votePercentage: 56.3,
  },
];

export function RecentWinners() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Recent Winners
        </CardTitle>
        <CardDescription>Latest election results</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockWinners.map((winner) => (
            <div
              key={winner.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="font-semibold">{winner.name}</div>
                  <Badge
                    className={`${PARTY_COLORS[winner.party]} text-white border-0 text-xs`}
                  >
                    {winner.party}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {winner.office} • {winner.state}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(winner.electionDate).toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {winner.votePercentage}%
                </div>
                <div className="text-xs text-muted-foreground">of vote</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
