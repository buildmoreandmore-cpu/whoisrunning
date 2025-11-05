"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { searchCandidates } from "@/lib/candidate-service";
import { Candidate } from "@/types/candidate";
import { CandidateCard } from "./CandidateCard";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Candidate[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const candidates = await searchCandidates({ name: query });
      setResults(candidates);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for candidates by name, office, or location..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </form>

      {/* Search Results */}
      {searched && (
        <div className="mt-8">
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
              <p className="text-muted-foreground">
                Searching for candidates using AI...
              </p>
            </div>
          ) : results.length > 0 ? (
            <>
              <h3 className="text-xl font-semibold mb-4">
                Found {results.length} candidate{results.length !== 1 ? "s" : ""}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((candidate) => (
                  <CandidateCard key={candidate.id} candidate={candidate} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-muted-foreground">
                No candidates found for &quot;{query}&quot;. Try a different search term.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
