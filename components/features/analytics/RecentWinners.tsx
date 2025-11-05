"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, Loader2 } from "lucide-react";
import { PARTY_COLORS } from "@/types/candidate";
import { getRecentWinners } from "@/lib/candidate-service";
import Link from "next/link";

export function RecentWinners() {
  const [winners, setWinners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWinners() {
      try {
        const data = await getRecentWinners();
        setWinners(data);
      } catch (error) {
        console.error("Error fetching winners:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWinners();
  }, []);

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
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {winners.map((winner) => (
              <Link
                href={`/candidate/${winner.id}`}
                key={winner.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-semibold">{winner.candidateName || winner.name}</div>
                    <Badge
                      className={`${winner.party && PARTY_COLORS[winner.party as keyof typeof PARTY_COLORS] ? PARTY_COLORS[winner.party as keyof typeof PARTY_COLORS] : "bg-gray-500"} text-white border-0 text-xs`}
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
                    {winner.votePercentage?.toFixed(1) || "N/A"}%
                  </div>
                  <div className="text-xs text-muted-foreground">of vote</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
