"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2, Flag } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ReportErrorButtonProps {
  candidateId: string;
  candidateName: string;
}

export function ReportErrorButton({
  candidateId,
  candidateName,
}: ReportErrorButtonProps) {
  const [open, setOpen] = useState(false);
  const [errorType, setErrorType] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/community/report-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId,
          candidateName,
          errorType,
          description,
          email,
          source,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to submit report");

      setSubmitted(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setOpen(false);
        setSubmitted(false);
        setErrorType("");
        setDescription("");
        setEmail("");
        setSource("");
      }, 3000);
    } catch (err) {
      setError("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Flag className="h-4 w-4" />
          Report an Error
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Help Us Get It Right</DialogTitle>
          <DialogDescription>
            Found outdated or incorrect information about {candidateName}? Let
            us know and help make democracy more transparent.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Thank you! Your report has been submitted. We&apos;ll review it
              and update the information as needed.
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="errorType">What needs correction?</Label>
              <Select value={errorType} onValueChange={setErrorType} required>
                <SelectTrigger id="errorType">
                  <SelectValue placeholder="Select error type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="outdated">
                    Outdated Information
                  </SelectItem>
                  <SelectItem value="incorrect">Incorrect Facts</SelectItem>
                  <SelectItem value="position">
                    Wrong Position/Statement
                  </SelectItem>
                  <SelectItem value="voting-record">
                    Voting Record Error
                  </SelectItem>
                  <SelectItem value="contact">
                    Contact Info Wrong
                  </SelectItem>
                  <SelectItem value="missing">Missing Information</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Details (What&apos;s wrong and what should it be?)
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g., The voting record says they voted 'Yes' on Bill XYZ, but they actually voted 'No' according to..."
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">
                Source (Optional but helpful)
              </Label>
              <Input
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Link to official record, news article, etc."
                type="url"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Your Email (Optional - for follow-up)
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="bg-blue-50 p-4 rounded-lg text-sm text-gray-700">
              <p className="font-semibold mb-1">Community-Powered Accuracy</p>
              <p>
                Every correction helps thousands of voters make informed
                decisions. Thank you for helping us maintain accurate
                information.
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
