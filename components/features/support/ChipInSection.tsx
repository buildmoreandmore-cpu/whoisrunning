"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Heart, Users, Clock, Shield, CheckCircle2 } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export function ChipInSection() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contributorCount, setContributorCount] = useState<number>(0);

  const suggestedAmounts = [5, 15, 50, 100];

  // Fetch contributor count on mount
  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/stats");
        const data = await response.json();
        setContributorCount(data.contributorCount);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    }
    fetchStats();
  }, []);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    setError(null);
  };

  const handleCustomAmount = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setSelectedAmount(numValue);
      setCustomAmount(value);
    } else {
      setSelectedAmount(null);
      setCustomAmount(value);
    }
    setError(null);
  };

  const handleChipIn = async () => {
    if (!selectedAmount || selectedAmount <= 0) return;

    setProcessing(true);
    setError(null);

    try {
      // Create checkout session
      const response = await fetch("/api/payment/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedAmount,
          isRecurring,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();

      if (!url) {
        throw new Error("No checkout URL received");
      }

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <section className="mb-12" id="chip-in">
        <Card className="bg-white border shadow-lg">
          <CardContent className="p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                Keep Democracy Free & Accessible
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                We don&apos;t run ads. We don&apos;t sell your data. We exist
                because you value informed voting.
              </p>
            </div>

            {/* Amount Selection */}
            <div className="max-w-2xl mx-auto mb-8">
              <p className="text-center text-lg text-gray-700 mb-4 font-medium">
                Chip in what you can:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {suggestedAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    className={`py-4 px-6 rounded-lg font-bold text-xl transition-all ${
                      selectedAmount === amount && !customAmount
                        ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300"
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-700">
                  $
                </span>
                <Input
                  type="number"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => handleCustomAmount(e.target.value)}
                  className="pl-10 py-6 text-xl bg-white text-gray-900 placeholder:text-gray-500 border-gray-300"
                  min="1"
                />
              </div>
            </div>

            {/* Recurring Option */}
            <div className="max-w-2xl mx-auto mb-8">
              <label className="flex items-center justify-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                  Make this a monthly contribution (cancel anytime)
                </span>
              </label>
            </div>

            {/* Impact Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-gray-600 mb-1">Every contribution helps us</p>
                <p className="font-semibold text-gray-900">
                  Verify 10,000+ candidate profiles monthly
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-gray-600 mb-1">Every contribution helps us</p>
                <p className="font-semibold text-gray-900">
                  Respond to corrections in 24 hours
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-gray-600 mb-1">Every contribution helps us</p>
                <p className="font-semibold text-gray-900">
                  Stay free, accurate, and ad-free forever
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="max-w-2xl mx-auto mb-4">
                <div className="bg-red-100 border border-red-300 text-red-800 rounded-lg p-4 text-sm">
                  {error}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleChipIn}
                disabled={!selectedAmount || selectedAmount <= 0 || processing}
                className="bg-gradient-to-br from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 font-bold text-lg px-8 py-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  "Processing..."
                ) : (
                  <>
                    {isRecurring ? "Chip In Monthly" : "Chip In Once"}
                    {selectedAmount && selectedAmount > 0 && (
                      <span className="ml-2">${selectedAmount}</span>
                    )}
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                disabled={processing}
                className="border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold text-lg px-8 py-6"
              >
                Maybe Later
              </Button>
            </div>

            {/* Social Proof */}
            <div className="text-center mt-8">
              <p className="text-gray-700 flex items-center justify-center gap-2">
                <Users className="h-5 w-5" />
                <span className="font-semibold">{contributorCount.toLocaleString()}</span> people
                chipped in this month
              </p>
              <a
                href="/contributors"
                className="text-sm text-blue-600 hover:text-blue-700 underline mt-2 inline-block"
              >
                See who&apos;s supporting democracy →
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>Cancel Anytime</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>100% Transparent</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>Non-Partisan</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
