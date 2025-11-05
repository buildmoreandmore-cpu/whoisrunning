"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react";
import { getTrendingCandidates } from "@/lib/candidate-service";
import Link from "next/link";

export function TrendingCandidates() {
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const data = await getTrendingCandidates();
        setTrending(data);
      } catch (error) {
        console.error("Error fetching trending:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTrending();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Trending Candidates
        </CardTitle>
        <CardDescription>Most talked about in the news right now</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {trending.map((candidate, index) => (
              <Link
                href={`/candidate/${candidate.id}`}
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
                    {candidate.searchCount?.toLocaleString() || "N/A"} searches
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
                    {Math.abs(candidate.percentageChange || 0).toFixed(1)}%
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
