"use client";

import { useState } from "react";
import { useLocationFilter } from "@/context/LocationContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationFilter } from "@/components/features/location-filter/LocationFilter";
import { Loader2, ChevronRight, ChevronLeft, Info } from "lucide-react";
import {
  DemographicProfile,
  ImpactAnalysisResult,
  AGE_RANGES,
  INCOME_RANGES,
  RACE_ETHNICITY_OPTIONS,
  EDUCATION_LEVELS,
  AgeRange,
  IncomeRange,
  RaceEthnicity,
  EducationLevel,
} from "@/types/demographics";

interface DemographicFormProps {
  onResults: (results: ImpactAnalysisResult) => void;
}

export function DemographicForm({ onResults }: DemographicFormProps) {
  const { selectedState, selectedCounty, selectedCity } = useLocationFilter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [ageRange, setAgeRange] = useState<AgeRange | null>(null);
  const [incomeRange, setIncomeRange] = useState<IncomeRange | null>(null);
  const [raceEthnicity, setRaceEthnicity] = useState<RaceEthnicity | null>(null);
  const [educationLevel, setEducationLevel] = useState<EducationLevel | null>(null);

  const totalSteps = 4;

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedState !== null;
      case 2:
        return ageRange !== null && incomeRange !== null;
      case 3:
        return raceEthnicity !== null && educationLevel !== null;
      case 4:
        return true; // Review step
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setError(null);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedState || !ageRange || !incomeRange || !raceEthnicity || !educationLevel) {
      setError("Please complete all required fields");
      return;
    }

    const demographics: DemographicProfile = {
      ageRange,
      incomeRange,
      raceEthnicity,
      educationLevel,
      location: {
        state: selectedState,
        county: selectedCounty || undefined,
        city: selectedCity || undefined,
      },
    };

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/demographics/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ demographics }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze demographics");
      }

      const result: ImpactAnalysisResult = await response.json();
      onResults(result);
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Failed to analyze your demographic profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-start gap-2 p-4 bg-blue-50 rounded-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-900">
                Select your location to see how local policies affect you. The more specific, the better!
              </p>
            </div>
            <LocationFilter />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Age Range</label>
              <Select
                value={ageRange || ""}
                onValueChange={(value) => setAgeRange(value as AgeRange)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your age range" />
                </SelectTrigger>
                <SelectContent>
                  {AGE_RANGES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Annual Household Income</label>
              <Select
                value={incomeRange || ""}
                onValueChange={(value) => setIncomeRange(value as IncomeRange)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your income range" />
                </SelectTrigger>
                <SelectContent>
                  {INCOME_RANGES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Race / Ethnicity</label>
              <Select
                value={raceEthnicity || ""}
                onValueChange={(value) => setRaceEthnicity(value as RaceEthnicity)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your race/ethnicity" />
                </SelectTrigger>
                <SelectContent>
                  {RACE_ETHNICITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Education Level</label>
              <Select
                value={educationLevel || ""}
                onValueChange={(value) => setEducationLevel(value as EducationLevel)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your education level" />
                </SelectTrigger>
                <SelectContent>
                  {EDUCATION_LEVELS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <h4 className="font-semibold">Your Profile Summary</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Location:</span>
                  <p className="font-medium">
                    {[selectedCity, selectedCounty, selectedState].filter(Boolean).join(", ")}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Age:</span>
                  <p className="font-medium">{ageRange}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Income:</span>
                  <p className="font-medium">
                    {INCOME_RANGES.find((r) => r.value === incomeRange)?.label}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Education:</span>
                  <p className="font-medium">{educationLevel}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 p-4 bg-green-50 rounded-lg">
              <Info className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-green-900">
                <p className="font-semibold mb-1">Privacy Notice</p>
                <p>
                  Your information is not stored. We only use it to generate your personalized
                  policy impact report.
                </p>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 rounded-lg text-sm text-red-900">
                {error}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Where do you live?";
      case 2:
        return "Tell us about yourself";
      case 3:
        return "Additional demographics";
      case 4:
        return "Review and analyze";
      default:
        return "";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2 w-8 rounded-full ${
                  i + 1 <= currentStep ? "bg-primary" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
        <CardTitle>{getStepTitle()}</CardTitle>
      </CardHeader>

      <CardContent>{renderStepContent()}</CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1 || loading}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        {currentStep < totalSteps ? (
          <Button onClick={handleNext} disabled={!canProceed()}>
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading || !canProceed()}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Impact"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
