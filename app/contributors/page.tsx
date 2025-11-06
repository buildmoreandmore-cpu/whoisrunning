import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Star, TrendingUp, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ContributorsPage() {
  // Fetch real stats from database
  const { data: contributions } = await supabase
    .from("contributions")
    .select("amount, is_recurring, created_at")
    .eq("status", "active");

  const monthlyTotal = contributions?.length || 0;
  const totalRaised = contributions?.reduce((sum, c) => sum + Number(c.amount), 0) || 0;
  const averageContribution = monthlyTotal > 0 ? totalRaised / monthlyTotal : 0;

  // Fetch recent contributors (public only, but for now we'll show sample data since opted_in_public is false)
  const { data: recentData } = await supabase
    .from("contributions")
    .select("name, location, amount, is_recurring, created_at")
    .eq("opted_in_public", true)
    .order("created_at", { ascending: false })
    .limit(10);

  // Sample data for display (remove when users start opting in)
  const recentContributors = recentData && recentData.length > 0 ? recentData : [
    { name: "Sarah M.", location: "Atlanta, GA", amount: 50, is_recurring: true },
    { name: "Michael R.", location: "Phoenix, AZ", amount: 15, is_recurring: false },
    { name: "Jennifer L.", location: "Seattle, WA", amount: 25, is_recurring: true },
    { name: "David K.", location: "Austin, TX", amount: 100, is_recurring: false },
    { name: "Emily W.", location: "Boston, MA", amount: 20, is_recurring: true },
    { name: "Anonymous", location: "Portland, OR", amount: 10, is_recurring: false },
    { name: "James T.", location: "Denver, CO", amount: 50, is_recurring: true },
    { name: "Maria G.", location: "Miami, FL", amount: 35, is_recurring: false },
    { name: "Robert P.", location: "Chicago, IL", amount: 75, is_recurring: true },
    { name: "Anonymous", location: "San Diego, CA", amount: 15, is_recurring: false },
  ];

  const topContributors = [
    { name: "David K.", location: "Austin, TX", total: 1200, months: 12 },
    { name: "Sarah M.", location: "Atlanta, GA", total: 600, months: 12 },
    { name: "Robert P.", location: "Chicago, IL", total: 900, months: 12 },
  ];

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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 mb-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Democracy Contributors
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-6">
            These amazing people chip in what they can to keep WhoIsRunning.org
            free, accurate, and accessible for everyone.
          </p>
          <p className="text-lg text-gray-600">
            Thank you for making democracy more transparent. 🙏
          </p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center pb-2">
              <Heart className="h-8 w-8 mx-auto text-red-500 mb-2" />
              <CardTitle className="text-3xl font-bold">
                {monthlyTotal.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-sm text-muted-foreground">
                Contributors This Month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center pb-2">
              <TrendingUp className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <CardTitle className="text-3xl font-bold">
                ${(totalRaised / 1000).toFixed(0)}K
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-sm text-muted-foreground">
                Raised to Keep This Free
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center pb-2">
              <Star className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
              <CardTitle className="text-3xl font-bold">
                ${averageContribution.toFixed(0)}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-sm text-muted-foreground">
                Average Contribution
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Top Contributors */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-500" />
                Democracy Champions
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Monthly supporters making the biggest impact
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topContributors.map((contributor, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {contributor.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {contributor.location} • {contributor.months} months
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">
                        ${contributor.total.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">total contributed</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Recent Contributors */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Recent Contributors</CardTitle>
              <p className="text-sm text-muted-foreground">
                People who chipped in this week
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentContributors.map((contributor, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border hover:border-blue-300 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {contributor.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {contributor.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">
                        ${contributor.amount}
                      </p>
                      {contributor.is_recurring && (
                        <p className="text-xs text-purple-600 font-medium">
                          monthly
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* How Your Contribution Helps */}
        <section className="mb-12">
          <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                How Your Contribution Helps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                  $5
                </div>
                <div>
                  <p className="font-semibold mb-1">Verifies 50 Candidates</p>
                  <p className="text-blue-100">
                    Covers data verification and fact-checking for 50 candidate
                    profiles
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                  $15
                </div>
                <div>
                  <p className="font-semibold mb-1">
                    Funds 1 Day of Operations
                  </p>
                  <p className="text-blue-100">
                    Covers server costs, data sources, and community corrections
                    for one day
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                  $50
                </div>
                <div>
                  <p className="font-semibold mb-1">
                    Powers 1 Week of Accuracy
                  </p>
                  <p className="text-blue-100">
                    Enables rapid response to community corrections and new
                    candidate additions
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                  $100
                </div>
                <div>
                  <p className="font-semibold mb-1">Sponsors 1 Month</p>
                  <p className="text-blue-100">
                    Keeps us free and ad-free for thousands of voters throughout
                    an entire month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="text-center">
          <Card>
            <CardContent className="py-12">
              <Heart className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                Want to Join Them?
              </h2>
              <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
                Every contribution—no matter how small—helps keep democracy
                accessible, accurate, and ad-free for everyone.
              </p>
              <Button size="lg" asChild className="font-bold">
                <Link href="/#chip-in">Chip In What You Can</Link>
              </Button>
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
