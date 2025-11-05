import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PARTY_COLORS } from "@/types/candidate";
import {
  ExternalLink,
  Globe,
  Twitter,
  Facebook,
  Youtube,
  FileText,
  Quote,
} from "lucide-react";

export default function CandidatePage({
  params,
}: {
  params: { id: string };
}) {
  // Mock candidate data - in production, this would fetch from Perplexity API
  const candidate = {
    id: params.id,
    name: "Sarah Johnson",
    party: "Democrat" as const,
    office: "Governor of California",
    state: "California",
    photo: null,
    bio: "Sarah Johnson has served in the California State Senate since 2016, where she has championed environmental protection, education reform, and healthcare access. Prior to her legislative career, she worked as a civil rights attorney and community organizer.",
    website: "https://example.com",
    socialMedia: {
      twitter: "https://twitter.com/example",
      facebook: "https://facebook.com/example",
    },
    ideology: [
      "Progressive",
      "Environmental Protection",
      "Healthcare Reform",
      "Education Access",
      "Criminal Justice Reform",
    ],
    keyPositions: [
      "Supports universal healthcare and expanding Medicare",
      "Advocates for 100% renewable energy by 2035",
      "Proposes increasing teacher salaries by 20%",
      "Supports criminal justice reform and ending cash bail",
      "Advocates for affordable housing initiatives",
    ],
    quotes: [
      {
        text: "We cannot afford to wait on climate action. The future of our children depends on the decisions we make today.",
        source: "Climate Summit 2024",
        date: "2024-09-15",
      },
      {
        text: "Healthcare is a human right, not a privilege reserved for the wealthy.",
        source: "Town Hall Meeting",
        date: "2024-08-22",
      },
    ],
    resources: [
      {
        type: "video",
        title: "Interview on Climate Policy",
        url: "https://youtube.com/watch?v=example",
        source: "PBS NewsHour",
      },
      {
        type: "article",
        title: "Governor Candidate's Healthcare Plan",
        url: "https://example.com/article",
        source: "LA Times",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <a href="/">← Back to Home</a>
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
                <Badge variant="outline" className="text-lg px-4 py-1">
                  {candidate.state}
                </Badge>
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="text-lg leading-relaxed mb-6">{candidate.bio}</p>

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
          </div>

          {/* Quotes & Resources */}
          <div className="space-y-8">
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
                        {quote.source} • {new Date(quote.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

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
          </div>
        </div>
      </main>
    </div>
  );
}
