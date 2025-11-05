"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface LocationState {
  selectedState: string | null;
  selectedCounty: string | null;
  selectedCity: string | null;
}

interface LocationContextType extends LocationState {
  setSelectedState: (state: string | null) => void;
  setSelectedCounty: (county: string | null) => void;
  setSelectedCity: (city: string | null) => void;
  resetFilters: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LocationState>({
    selectedState: null,
    selectedCounty: null,
    selectedCity: null,
  });

  const setSelectedState = useCallback((newState: string | null) => {
    setState((prev) => ({
      ...prev,
      selectedState: newState,
      selectedCounty: null, // Reset dependent filters (State → County → City)
      selectedCity: null,
    }));
  }, []);

  const setSelectedCounty = useCallback((county: string | null) => {
    setState((prev) => ({
      ...prev,
      selectedCounty: county,
      selectedCity: null, // Reset dependent filter (County → City)
    }));
  }, []);

  const setSelectedCity = useCallback((city: string | null) => {
    setState((prev) => ({
      ...prev,
      selectedCity: city,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setState({
      selectedState: null,
      selectedCounty: null,
      selectedCity: null,
    });
  }, []);

  return (
    <LocationContext.Provider
      value={{
        ...state,
        setSelectedState,
        setSelectedCounty,
        setSelectedCity,
        resetFilters,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationFilter() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocationFilter must be used within LocationProvider");
  }
  return context;
}
