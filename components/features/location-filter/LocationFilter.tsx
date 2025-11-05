"use client";

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
import { MapPin, X } from "lucide-react";

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

  // For demo purposes, mock counties and cities
  const counties = selectedState
    ? ["County 1", "County 2", "County 3"]
    : [];

  const cities = selectedCounty
    ? ["City 1", "City 2", "City 3"]
    : [];

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

        {/* City Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            City
          </label>
          <Select
            value={selectedCity || ""}
            onValueChange={(value) => setSelectedCity(value || null)}
            disabled={!selectedState}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
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
            disabled={!selectedCity}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select County" />
            </SelectTrigger>
            <SelectContent>
              {counties.map((county) => (
                <SelectItem key={county} value={county}>
                  {county}
                </SelectItem>
              ))}
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
          {selectedCity && (
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
              {selectedCity}
            </div>
          )}
          {selectedCounty && (
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
              {selectedCounty}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
