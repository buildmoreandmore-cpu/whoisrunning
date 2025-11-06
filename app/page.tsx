import { TrendingCandidatesServer } from "@/components/features/analytics/TrendingCandidatesServer";
import { LocationFilter } from "@/components/features/location-filter/LocationFilter";
import { PoliticianResults } from "@/components/features/location-filter/PoliticianResults";
import { RecentWinnersServer } from "@/components/features/analytics/RecentWinnersServer";
import { SearchBar } from "@/components/features/candidate/SearchBar";
import Image from "next/image";
import { Search, MapPin, TrendingUp, Award } from "lucide-react";

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
          <h2 className="text-3xl font-bold mb-4">
            Discover Who&apos;s Running in Your Area
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Get transparent, unbiased information about political candidates with resources,
            voting records, quotes, and ideological positions.
          </p>
          <SearchBar />
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

        {/* CTA Section */}
        <section className="bg-white rounded-lg p-8 text-center shadow-lg border">
          <h3 className="text-2xl font-bold mb-4 text-foreground">
            Stay Informed, Make Better Decisions
          </h3>
          <p className="mb-6 max-w-2xl mx-auto text-muted-foreground">
            Research candidates and make informed choices in every election.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-white/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 WhoIsRunning.org - Political Transparency Platform</p>
        </div>
      </footer>
    </div>
  );
}
