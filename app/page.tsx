import { TrendingCandidatesServer } from "@/components/features/analytics/TrendingCandidatesServer";
import { LocationFilter } from "@/components/features/location-filter/LocationFilter";
import { PoliticianResults } from "@/components/features/location-filter/PoliticianResults";
import { RecentWinnersServer } from "@/components/features/analytics/RecentWinnersServer";
import { SearchBar } from "@/components/features/candidate/SearchBar";
import { ChipInSection } from "@/components/features/support/ChipInSection";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, TrendingUp, Award, Calculator, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

// Force dynamic rendering to fetch fresh data on every request
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-start">
            <Image
              src="/logo-transparent.png"
              alt="Who Is Running Logo"
              width={150}
              height={60}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Stop Voting Blind
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-6">
            Know who you&apos;re actually voting for—without spending hours researching.
          </p>
          <p className="text-base text-gray-600 max-w-2xl mx-auto mb-8">
            Find your local candidates&apos; positions, voting records, and what they actually stand for.
            All in one place, in minutes.
          </p>
          <SearchBar />
        </section>

        {/* Why We Exist - Authentic Origin Story */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 border-l-4 border-blue-600">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Why This Exists</h3>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                I missed a local election once. Not because I didn&apos;t care—but because figuring out
                who was running for school board, city council, and county positions felt like a part-time job.
              </p>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                I spent hours clicking through outdated websites, hunting for voting records, and trying to
                understand what candidates actually believed. By the time I felt informed enough, the election
                had passed.
              </p>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                That year, decisions were made about my kid&apos;s school, my neighborhood&apos;s budget, and
                policies that directly affected my family—and I had no say in it.
              </p>
              <p className="text-lg font-semibold text-gray-900 mb-2">
                Never again.
              </p>
              <p className="text-base text-gray-600">
                This tool exists so you never have that moment. Democracy shouldn&apos;t require a research degree.
                You deserve to know who you&apos;re voting for without sacrificing your evenings and weekends.
              </p>
              <p className="text-sm text-gray-500 mt-6 italic">
                - Built by voters who got tired of voting blind
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-center mb-8">How to Use WhoIsRunning.org</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <Search className="h-8 w-8" />
                </div>
                <h4 className="font-semibold text-lg mb-2">1. Search by Name</h4>
                <p className="text-sm text-muted-foreground">
                  Type a candidate&apos;s name in the search bar above to get instant information about their campaign and positions.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mb-4">
                  <MapPin className="h-8 w-8" />
                </div>
                <h4 className="font-semibold text-lg mb-2">2. Filter by Location</h4>
                <p className="text-sm text-muted-foreground">
                  Use the location filters below to find politicians running in your state, city, or county.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <h4 className="font-semibold text-lg mb-2">3. Explore Trending</h4>
                <p className="text-sm text-muted-foreground">
                  Check out trending candidates making headlines and recent election winners in the sections below.
                </p>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-600 mb-4">
                  <Award className="h-8 w-8" />
                </div>
                <h4 className="font-semibold text-lg mb-2">4. View Details</h4>
                <p className="text-sm text-muted-foreground">
                  Click any candidate card to see detailed information including quotes, voting records, and resources.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Location Filter */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Look up Politician in your Area</h3>
            <LocationFilter />
            <PoliticianResults />
          </div>
        </section>

        {/* Trending Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <TrendingCandidatesServer />
          <RecentWinnersServer />
        </section>

        {/* Impact Calculator CTA */}
        <section className="bg-white rounded-lg p-8 text-center shadow-lg border mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <Calculator className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-foreground">
            See How Local Policies Affect You
          </h3>
          <p className="mb-6 max-w-2xl mx-auto text-muted-foreground">
            Enter your demographics and get a personalized report showing how state and local
            policies impact your taxes, healthcare, education, housing, and more.
          </p>
          <Button size="lg" asChild>
            <Link href="/impact-calculator">
              Try Impact Calculator
              <Calculator className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </section>

        {/* Chip In Section */}
        <ChipInSection />

        {/* Community Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 sm:p-6 md:p-8 border-l-4 border-blue-600">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="flex-shrink-0">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-600">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
              </div>
              <div className="flex-1 w-full">
                <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">
                  Community-Powered Accuracy
                </h3>
                <p className="text-base sm:text-lg text-gray-700 mb-4">
                  Found an error? Outdated info? You can help. Every correction you submit
                  helps thousands of voters make informed decisions.
                </p>
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
                  <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">247</p>
                    <p className="text-xs sm:text-sm text-gray-600">Community Corrections</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">24hr</p>
                    <p className="text-xs sm:text-sm text-gray-600">Avg Response Time</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">98%</p>
                    <p className="text-xs sm:text-sm text-gray-600">Data Accuracy</p>
                  </div>
                </div>
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/community">
                    <span className="hidden sm:inline">Learn How Community Corrections Work</span>
                    <span className="sm:hidden">Learn How It Works</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Mission Driven */}
        <section className="bg-white rounded-lg p-8 text-center shadow-lg border">
          <h3 className="text-2xl font-bold mb-4 text-gray-900">
            Your Vote Matters. Now You&apos;ll Know Why.
          </h3>
          <p className="mb-6 max-w-2xl mx-auto text-gray-700 text-lg">
            Local elections shape your schools, taxes, public safety, and neighborhood.
            You shouldn&apos;t need a PhD in political science to make informed choices.
          </p>
          <div className="bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto mt-6">
            <p className="text-base text-gray-700 mb-4">
              <span className="font-semibold">We&apos;re not perfect.</span> Found an error? Let us know.
              This is a work in progress built by real people who believe democracy should be accessible to everyone.
            </p>
            <p className="text-sm text-gray-600">
              Non-partisan. No ads. Just the information you need to vote confidently.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-white/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600 mb-2">
            &copy; 2025 WhoIsRunning.org - Built by voters, for voters
          </p>
          <p className="text-xs text-gray-500">
            Non-partisan political transparency platform. Democracy shouldn&apos;t be a part-time job.
          </p>
        </div>
      </footer>
    </div>
  );
}
