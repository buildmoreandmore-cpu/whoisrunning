"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PARTY_COLORS, Candidate } from "@/types/candidate";
import {
  ExternalLink,
  Globe,
  Twitter,
  Facebook,
  Youtube,
  FileText,
  Quote,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { getCandidateDetails } from "@/lib/candidate-service";
import Link from "next/link";
import { ReportErrorButton } from "@/components/features/community/ReportErrorButton";

interface CandidateDetailClientProps {
  candidateId: string;
  candidateName: string;
}

export function CandidateDetailClient({
  candidateId,
  candidateName,
}: CandidateDetailClientProps) {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCandidate() {
      try {
        const data = await getCandidateDetails(candidateId, candidateName);
        setCandidate(data);
      } catch (err) {
        console.error("Error fetching candidate:", err);
        setError("Failed to load candidate information");
      } finally {
        setLoading(false);
      }
    }

    fetchCandidate();
  }, [candidateId, candidateName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
          <p className="text-lg text-muted-foreground">
            Loading candidate information...
          </p>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <header className="border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </header>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Candidate Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn&apos;t find information for this candidate.
          </p>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Candidate Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{candidate.name}</h1>
              <p className="text-xl text-muted-foreground mb-4">
                {candidate.office}
              </p>
              <div className="flex items-center gap-4">
                <Badge
                  className={`${PARTY_COLORS[candidate.party]} text-white border-0 text-lg px-4 py-1`}
                >
                  {candidate.party}
                </Badge>
                {candidate.state && (
                  <Badge variant="outline" className="text-lg px-4 py-1">
                    {candidate.state}
                  </Badge>
                )}
              </div>
            </div>
            <ReportErrorButton
              candidateId={candidateId}
              candidateName={candidate.name}
            />
          </div>

          {/* Bio */}
          {candidate.bio && (
            <p className="text-lg leading-relaxed mb-6">{candidate.bio}</p>
          )}

          {/* Social Links */}
          <div className="flex gap-2">
            {candidate.website && (
              <Button variant="outline" asChild>
                <a
                  href={candidate.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Website
                </a>
              </Button>
            )}
            {candidate.socialMedia?.twitter && (
              <Button variant="outline" size="icon" asChild>
                <a
                  href={candidate.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
            )}
            {candidate.socialMedia?.facebook && (
              <Button variant="outline" size="icon" asChild>
                <a
                  href={candidate.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ideology & Positions */}
          <div className="space-y-8">
            {candidate.ideology && candidate.ideology.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Political Ideology
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {candidate.ideology.map((tag, idx) => (
                      <Badge key={idx} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {candidate.keyPositions && candidate.keyPositions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Key Positions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {candidate.keyPositions.map((position, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{position}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Quotes & Resources */}
          <div className="space-y-8">
            {candidate.quotes && candidate.quotes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Quote className="h-5 w-5" />
                    Notable Quotes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {candidate.quotes.map((quote, idx) => (
                      <div key={idx} className="border-l-4 border-primary pl-4">
                        <p className="italic mb-2">&ldquo;{quote.text}&rdquo;</p>
                        <p className="text-sm text-muted-foreground">
                          {quote.source} •{" "}
                          {new Date(quote.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {candidate.resources && candidate.resources.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Youtube className="h-5 w-5" />
                    Resources & Media
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {candidate.resources.map((resource, idx) => (
                      <a
                        key={idx}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
                      >
                        <div>
                          <div className="font-medium">{resource.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {resource.source}
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
