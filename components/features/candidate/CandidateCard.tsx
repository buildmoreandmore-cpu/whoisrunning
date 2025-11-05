"use client";

import { Candidate, PARTY_COLORS } from "@/types/candidate";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin, Briefcase } from "lucide-react";
import Link from "next/link";

interface CandidateCardProps {
  candidate: Candidate;
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{candidate.name}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              {candidate.office}
            </CardDescription>
            <CardDescription className="flex items-center gap-2 mt-1">
              <MapPin className="h-4 w-4" />
              {candidate.city && `${candidate.city}, `}
              {candidate.county && `${candidate.county}, `}
              {candidate.state}
            </CardDescription>
          </div>
          <Badge
            className={`${PARTY_COLORS[candidate.party]} text-white border-0`}
          >
            {candidate.party}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Ideology Tags */}
        {candidate.ideology && candidate.ideology.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {candidate.ideology.slice(0, 3).map((tag, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {candidate.ideology.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{candidate.ideology.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Bio Preview */}
        {candidate.bio && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {candidate.bio}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href={`/candidate/${candidate.id}`}>
              View Full Profile
            </Link>
          </Button>
          {candidate.website && (
            <Button variant="outline" size="icon" asChild>
              <a
                href={candidate.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
