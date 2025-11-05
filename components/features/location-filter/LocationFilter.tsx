"use client";

import { useEffect, useState } from "react";
import { useLocationFilter } from "@/context/LocationContext";
import { US_STATES } from "@/types/location";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MapPin, X, Loader2 } from "lucide-react";

interface County {
  name: string;
  fips: string;
  fullName: string;
}

interface City {
  name: string;
  population: number;
  fips: string;
  fullName: string;
}

export function LocationFilter() {
  const {
    selectedState,
    selectedCounty,
    selectedCity,
    setSelectedState,
    setSelectedCounty,
    setSelectedCity,
    resetFilters,
  } = useLocationFilter();

  const [counties, setCounties] = useState<County[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCounties, setLoadingCounties] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Fetch counties when state is selected
  useEffect(() => {
    if (!selectedState) {
      setCounties([]);
      return;
    }

    const fetchCounties = async () => {
      setLoadingCounties(true);
      try {
        const response = await fetch(`/api/location/counties?state=${selectedState}`);
        if (response.ok) {
          const data = await response.json();
          setCounties(data.counties || []);
        }
      } catch (error) {
        console.error("Error fetching counties:", error);
      } finally {
        setLoadingCounties(false);
      }
    };

    fetchCounties();
  }, [selectedState]);

  // Fetch cities when state and county are selected
  useEffect(() => {
    if (!selectedState || !selectedCounty) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const countyData = counties.find(c => c.name === selectedCounty);
        const countyFips = countyData?.fips || "";
        const response = await fetch(`/api/location/cities?state=${selectedState}&county=${countyFips}`);
        if (response.ok) {
          const data = await response.json();
          setCities(data.cities || []);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [selectedState, selectedCounty, counties]);

  const hasActiveFilters = selectedState || selectedCounty || selectedCity;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-primary" />
        <span className="font-semibold">Filter by Location</span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="ml-auto"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* State Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            State
          </label>
          <Select
            value={selectedState || ""}
            onValueChange={(value) => setSelectedState(value || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((state) => (
                <SelectItem key={state.code} value={state.code}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* County Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            County
          </label>
          <Select
            value={selectedCounty || ""}
            onValueChange={(value) => setSelectedCounty(value || null)}
            disabled={!selectedState || loadingCounties}
          >
            <SelectTrigger>
              <SelectValue placeholder={loadingCounties ? "Loading..." : "Select County"} />
            </SelectTrigger>
            <SelectContent>
              {loadingCounties ? (
                <div className="flex items-center justify-center p-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                counties.map((county) => (
                  <SelectItem key={county.fips} value={county.name}>
                    {county.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* City Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            City
          </label>
          <Select
            value={selectedCity || ""}
            onValueChange={(value) => setSelectedCity(value || null)}
            disabled={!selectedCounty || loadingCities}
          >
            <SelectTrigger>
              <SelectValue placeholder={loadingCities ? "Loading..." : "Select City"} />
            </SelectTrigger>
            <SelectContent>
              {loadingCities ? (
                <div className="flex items-center justify-center p-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                cities.map((city) => (
                  <SelectItem key={city.fips} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2">
          {selectedState && (
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
              {US_STATES.find((s) => s.code === selectedState)?.name}
            </div>
          )}
          {selectedCounty && (
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
              {selectedCounty} County
            </div>
          )}
          {selectedCity && (
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
              {selectedCity}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
