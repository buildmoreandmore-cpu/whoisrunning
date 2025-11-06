"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ExternalLink, RotateCcw } from "lucide-react";
import { ImpactAnalysisResult, PolicyCategory } from "@/types/demographics";
import { groupImpactsByCategory } from "@/lib/demographics-utils";

interface ImpactResultsProps {
  results: ImpactAnalysisResult;
  onReset: () => void;
}

const CATEGORY_COLORS: Record<PolicyCategory, string> = {
  "Tax Policies": "bg-blue-100 text-blue-800",
  Education: "bg-purple-100 text-purple-800",
  Healthcare: "bg-red-100 text-red-800",
  Housing: "bg-orange-100 text-orange-800",
  Employment: "bg-green-100 text-green-800",
  Transportation: "bg-yellow-100 text-yellow-800",
  "Social Services": "bg-pink-100 text-pink-800",
};

const CATEGORY_ICONS: Record<PolicyCategory, string> = {
  "Tax Policies": "💰",
  Education: "📚",
  Healthcare: "🏥",
  Housing: "🏠",
  Employment: "💼",
  Transportation: "🚗",
  "Social Services": "🤝",
};

export function ImpactResults({ results, onReset }: ImpactResultsProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<PolicyCategory>>(
    new Set()
  );

  const groupedImpacts = groupImpactsByCategory(results.impacts);
  const categories = Object.keys(groupedImpacts) as PolicyCategory[];

  const toggleCategory = (category: PolicyCategory) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const formatLocation = () => {
    const { city, county, state } = results.demographics.location;
    return [city, county, state].filter(Boolean).join(", ");
  };

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">Your Policy Impact Report</CardTitle>
              <p className="text-sm text-muted-foreground">
                {formatLocation()} • {results.demographics.ageRange} •{" "}
                {results.demographics.incomeRange}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={onReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              New Analysis
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed">{results.summary}</p>
        </CardContent>
      </Card>

      {/* Impact Categories */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Policy Impacts by Category</h3>

        {categories.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <p>No specific policy impacts found. Try adjusting your location or demographics.</p>
            </CardContent>
          </Card>
        ) : (
          categories.map((category) => {
            const impacts = groupedImpacts[category];
            const isExpanded = expandedCategories.has(category);

            return (
              <Card key={category} className="overflow-hidden">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full text-left p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{CATEGORY_ICONS[category]}</span>
                      <div>
                        <h4 className="font-semibold text-lg">{category}</h4>
                        <p className="text-sm text-muted-foreground">
                          {impacts.length} {impacts.length === 1 ? "impact" : "impacts"} found
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={CATEGORY_COLORS[category]}>{impacts.length}</Badge>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t bg-gray-50 p-6 space-y-4">
                    {impacts.map((impact, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-lg p-4 border border-gray-200"
                      >
                        <h5 className="font-semibold mb-2">{impact.title}</h5>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {impact.description}
                        </p>
                        {impact.source && (
                          <p className="text-xs text-primary mt-2">Source: {impact.source}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Citations */}
      {results.citations && results.citations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sources & Citations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.citations.map((citation, idx) => (
                <a
                  key={idx}
                  href={citation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  {citation.title || citation.url}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <div className="text-xs text-muted-foreground text-center p-4 bg-gray-50 rounded-lg">
        <p>
          This analysis is based on publicly available information and AI research. Policy impacts
          may vary based on individual circumstances. Always verify with official sources.
        </p>
        <p className="mt-1">
          Generated on {new Date(results.timestamp).toLocaleDateString()} at{" "}
          {new Date(results.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
