"use client";

import { useEffect, useState } from "react";
import { useLocationFilter } from "@/context/LocationContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users } from "lucide-react";
import Link from "next/link";

interface Politician {
  id: string;
  name: string;
  office: string;
  party: string;
  state?: string;
}

const PARTY_COLORS: { [key: string]: string } = {
  Democrat: "bg-blue-600",
  Republican: "bg-red-600",
  Independent: "bg-purple-600",
};

export function PoliticianResults() {
  const { selectedState, selectedCity, selectedCounty } = useLocationFilter();
  const [politicians, setPoliticians] = useState<Politician[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only search if at least state is selected
    if (!selectedState) {
      setPoliticians([]);
      return;
    }

    const fetchPoliticians = async () => {
      setLoading(true);
      try {
        // Build location string for query
        let location = selectedState;
        if (selectedCity) location += `, ${selectedCity}`;
        if (selectedCounty) location += `, ${selectedCounty} County`;

        const response = await fetch("/api/location/politicians", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ location }),
        });

        if (response.ok) {
          const data = await response.json();
          setPoliticians(data.politicians || []);
        }
      } catch (error) {
        console.error("Error fetching politicians:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPoliticians();
  }, [selectedState, selectedCity, selectedCounty]);

  // Don't show anything if no state selected
  if (!selectedState) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Politicians in Your Area
        </CardTitle>
        <CardDescription>
          Currently serving officials in{" "}
          {selectedCity && `${selectedCity}, `}
          {selectedCounty && `${selectedCounty} County, `}
          {selectedState}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">
              Loading politicians...
            </span>
          </div>
        ) : politicians.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No politicians found for this location.</p>
            <p className="text-sm mt-2">Try selecting a different area.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {politicians.map((politician) => (
              <Link
                key={politician.id}
                href={`/candidate/${politician.id}`}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-accent transition-colors border"
              >
                <div className="flex-1">
                  <div className="font-semibold text-lg">{politician.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {politician.office}
                  </div>
                </div>
                <Badge
                  className={`${
                    PARTY_COLORS[politician.party] || "bg-gray-500"
                  } text-white border-0`}
                >
                  {politician.party}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
