import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  Shield,
  Heart,
  ArrowLeft,
  Flag,
  Mail,
} from "lucide-react";
import Image from "next/image";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Image
                src="/logo-transparent.png"
                alt="Who Is Running Logo"
                width={150}
                height={60}
                className="object-contain"
                priority
              />
            </Link>
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Community-Powered Accuracy
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Every correction, every report, every contribution helps thousands
            of voters make informed decisions. Together, we&apos;re making
            democracy more transparent.
          </p>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mx-auto mb-2">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold">247</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Community Corrections Implemented
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mx-auto mb-2">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-3xl font-bold">24hr</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Average Response Time to Reports
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mx-auto mb-2">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-3xl font-bold">98%</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Data Accuracy (Verified Monthly)
              </p>
            </CardContent>
          </Card>
        </section>

        {/* How It Works */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                How Community Corrections Work
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    You Spot an Error
                  </h3>
                  <p className="text-muted-foreground">
                    See something wrong or outdated on a candidate page? Click
                    &quot;Report an Error&quot; and tell us what needs fixing.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">We Verify</h3>
                  <p className="text-muted-foreground">
                    Our team reviews your report, checks your sources, and
                    verifies the information against official records.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    We Update & Thank You
                  </h3>
                  <p className="text-muted-foreground">
                    If the correction is valid, we update the information
                    immediately. Thousands of voters benefit from your
                    contribution.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Community Guidelines */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Our Commitment to Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">
                  Non-Partisan & Fact-Based
                </h3>
                <p className="text-muted-foreground">
                  We verify all information against official government records,
                  voting databases, and credible news sources. We don&apos;t
                  editorialize or inject bias—just facts.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Source Requirements</h3>
                <p className="text-muted-foreground">
                  Every piece of information is linked to its source. If you
                  submit a correction, we ask for sources so we can verify
                  before updating.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Transparency First</h3>
                <p className="text-muted-foreground">
                  We&apos;re not perfect, and we own it. When we make mistakes,
                  we fix them fast. When community members help us improve, we
                  thank them publicly (with permission).
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">No Ads, No Agenda</h3>
                <p className="text-muted-foreground">
                  We don&apos;t run political ads. We don&apos;t accept money
                  from campaigns. We exist to help voters make informed
                  decisions, period.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Recent Corrections */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Recent Community Corrections
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Examples of how community reports improved our data
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <p className="font-medium">
                    Updated voting record for Senator Smith
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Community member corrected H.R. 1234 vote from &quot;Yea&quot; to
                    &quot;Nay&quot; with official Senate.gov source
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Fixed in 6 hours • Verified Jan 15, 2025
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <p className="font-medium">
                    Added missing campaign website for City Council candidate
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Local voter provided updated campaign contact information
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Fixed in 2 hours • Verified Jan 14, 2025
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <p className="font-medium">
                    Corrected district boundaries for State Rep race
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Community flagged outdated redistricting map
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Fixed in 12 hours • Verified Jan 12, 2025
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <CardContent className="py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                Help Us Keep Democracy Transparent
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
                Every report matters. Every correction helps. Together,
                we&apos;re building the most accurate political information
                platform in America.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/">
                    <Flag className="mr-2 h-5 w-5" />
                    Find a Candidate to Review
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="mailto:community@whoisrunning.org">
                    <Mail className="mr-2 h-5 w-5" />
                    Contact the Team
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-white/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600 mb-2">
            &copy; 2025 WhoIsRunning.org - Built by voters, for voters
          </p>
          <p className="text-xs text-gray-500">
            Non-partisan political transparency platform. Democracy
            shouldn&apos;t be a part-time job.
          </p>
        </div>
      </footer>
    </div>
  );
}
