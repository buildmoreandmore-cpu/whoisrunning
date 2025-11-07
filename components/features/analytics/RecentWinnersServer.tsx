import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { getRecentWinnersServer } from "@/lib/server-candidate-service";
import Link from "next/link";

type PartyColor = {
  Democrat: string;
  Republican: string;
  Independent: string;
  [key: string]: string;
};

const PARTY_COLORS: PartyColor = {
  Democrat: "bg-blue-600",
  Republican: "bg-red-600",
  Independent: "bg-purple-600",
};

export async function RecentWinnersServer() {
  const winners = await getRecentWinnersServer();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Live Race Updates
        </CardTitle>
        <CardDescription>Breaking election news and current races</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {winners.map((winner) => (
            <Link
              href={`/candidate/${winner.id}`}
              key={winner.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <div>
                  <div className="font-semibold">{winner.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {winner.office} • {winner.state}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  className={`${
                    winner.party && PARTY_COLORS[winner.party as keyof typeof PARTY_COLORS]
                      ? PARTY_COLORS[winner.party as keyof typeof PARTY_COLORS]
                      : "bg-gray-500"
                  } text-white border-0 text-xs`}
                >
                  {winner.party}
                </Badge>
                {winner.votePercentage && (
                  <div className="text-sm font-medium">{winner.votePercentage}%</div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
