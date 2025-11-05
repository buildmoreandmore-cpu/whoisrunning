import { TrendingCandidatesServer } from "@/components/features/analytics/TrendingCandidatesServer";
import { LocationFilter } from "@/components/features/location-filter/LocationFilter";
import { RecentWinnersServer } from "@/components/features/analytics/RecentWinnersServer";
import { SearchBar } from "@/components/features/candidate/SearchBar";
import Image from "next/image";

// Force dynamic rendering to fetch fresh data on every request
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Who Is Running Logo"
              width={80}
              height={80}
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

        {/* Location Filter */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Browse by Location</h3>
            <LocationFilter />
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
            Our platform uses AI-powered research to bring you comprehensive,
            fact-checked information about every candidate running for office.
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
