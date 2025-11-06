"use client";

import { useState } from "react";
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

  const suggestedAmounts = [5, 15, 50, 100];

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

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const contributorCount = 2847; // This will be dynamic from database later

  return (
    <>
      <section className="mb-12">
        <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0 shadow-xl">
          <CardContent className="p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Keep Democracy Free & Accessible
              </h2>
              <p className="text-xl text-blue-50 max-w-3xl mx-auto">
                We don&apos;t run ads. We don&apos;t sell your data. We exist
                because you value informed voting.
              </p>
            </div>

            {/* Amount Selection */}
            <div className="max-w-2xl mx-auto mb-8">
              <p className="text-center text-lg text-blue-50 mb-4 font-medium">
                Chip in what you can:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {suggestedAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    className={`py-4 px-6 rounded-lg font-bold text-xl transition-all ${
                      selectedAmount === amount && !customAmount
                        ? "bg-white text-blue-600 shadow-lg scale-105"
                        : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
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
                  className="pl-10 py-6 text-xl bg-white text-gray-900 placeholder:text-gray-500"
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
                  className="w-5 h-5 rounded border-white/30 text-blue-600 focus:ring-2 focus:ring-white/50"
                />
                <span className="text-blue-50 group-hover:text-white transition-colors">
                  Make this a monthly contribution (cancel anytime)
                </span>
              </label>
            </div>

            {/* Impact Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-100" />
                <p className="text-sm text-blue-100 mb-1">Every contribution helps us</p>
                <p className="font-semibold text-white">
                  Verify 10,000+ candidate profiles monthly
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-blue-100" />
                <p className="text-sm text-blue-100 mb-1">Every contribution helps us</p>
                <p className="font-semibold text-white">
                  Respond to corrections in 24 hours
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 text-blue-100" />
                <p className="text-sm text-blue-100 mb-1">Every contribution helps us</p>
                <p className="font-semibold text-white">
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
                className="bg-white text-blue-600 hover:bg-blue-50 font-bold text-lg px-8 py-6 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="border-white/30 text-white hover:bg-white/10 font-semibold text-lg px-8 py-6"
              >
                Maybe Later
              </Button>
            </div>

            {/* Social Proof */}
            <div className="text-center mt-8">
              <p className="text-blue-100 flex items-center justify-center gap-2">
                <Users className="h-5 w-5" />
                <span className="font-semibold">{contributorCount.toLocaleString()}</span> people
                chipped in this month
              </p>
              <a
                href="/contributors"
                className="text-sm text-blue-100 hover:text-white underline mt-2 inline-block"
              >
                See who&apos;s supporting democracy →
              </a>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
