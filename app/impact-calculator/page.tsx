"use client";

import { useState } from "react";
import { DemographicForm } from "@/components/features/impact-calculator/DemographicForm";
import { ImpactResults } from "@/components/features/impact-calculator/ImpactResults";
import { ImpactAnalysisResult } from "@/types/demographics";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Users, BarChart3, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ImpactCalculatorPage() {
  const [results, setResults] = useState<ImpactAnalysisResult | null>(null);

  const handleReset = () => {
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Image
                src="/logo-transparent.png"
                alt="Who Is Running Logo"
                width={150}
                height={60}
                className="object-contain"
                priority
              />
            </Link>
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!results ? (
          <>
            {/* Hero Section */}
            <section className="text-center mb-12 max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold mb-4">
                How Do Local Policies Affect You?
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Discover how state and local policies impact your daily life based on your
                demographics and location. Get personalized insights in minutes.
              </p>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Personalized Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Get policy impacts tailored to your age, income, education, and location
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 mb-4">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Comprehensive Coverage</h3>
                  <p className="text-sm text-muted-foreground">
                    Analyze 7 policy areas from taxes to healthcare to social services
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">100% Private</h3>
                  <p className="text-sm text-muted-foreground">
                    No data storage, no tracking. Your information stays private.
                  </p>
                </div>
              </div>
            </section>

            {/* Form Section */}
            <section>
              <DemographicForm onResults={setResults} />
            </section>

            {/* Info Section */}
            <section className="mt-12 max-w-3xl mx-auto">
              <div className="bg-white rounded-lg p-8 shadow-sm border">
                <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Tax Policies:</strong> How state and local
                    tax rates affect your income bracket
                  </p>
                  <p>
                    <strong className="text-foreground">Education:</strong> School funding, college
                    affordability programs, and educational resources
                  </p>
                  <p>
                    <strong className="text-foreground">Healthcare:</strong> Insurance costs,
                    Medicaid eligibility, and health program availability
                  </p>
                  <p>
                    <strong className="text-foreground">Housing:</strong> Rent control, property
                    taxes, and housing assistance programs
                  </p>
                  <p>
                    <strong className="text-foreground">Employment:</strong> Minimum wage, worker
                    protections, and job training programs
                  </p>
                  <p>
                    <strong className="text-foreground">Transportation:</strong> Public transit
                    access, infrastructure, and commute costs
                  </p>
                  <p>
                    <strong className="text-foreground">Social Services:</strong> Food assistance,
                    childcare support, and benefit programs
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <ImpactResults results={results} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-white/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 WhoIsRunning.org - Political Transparency Platform</p>
        </div>
      </footer>
    </div>
  );
}
