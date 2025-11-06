# Stripe Payment Integration Guide for WhoIsRunning.org

## Overview

This guide will walk you through integrating Stripe to enable the "Chip In What You Can" payment feature.

## What's Already Built

✅ **ChipInSection Component** - Complete UI with amount selection and recurring options
✅ **Contributors Page** - Recognition page for supporters
✅ **Payment Dialog** - Modal ready for Stripe integration
✅ **Database Schema Ready** - Just needs to be connected

## Step 1: Create Stripe Account

1. Go to https://stripe.com
2. Sign up for a free account
3. Complete business verification (required for live payments)
4. Get your API keys:
   - Dashboard → Developers → API keys
   - Copy **Publishable key** (starts with `pk_`)
   - Copy **Secret key** (starts with `sk_`)

## Step 2: Install Stripe Dependencies

```bash
npm install @stripe/stripe-js stripe
```

## Step 3: Add Environment Variables

Add to `.env.local`:

```bash
# Stripe API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Stripe Webhook Secret (get this in Step 5)
STRIPE_WEBHOOK_SECRET=whsec_...
```

Add to Vercel environment variables:
```bash
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
```

## Step 4: Create Stripe Payment API Endpoint

Create `/app/api/payment/create-checkout/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function POST(request: NextRequest) {
  try {
    const { amount, isRecurring } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    const params: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Support WhoIsRunning.org",
              description: "Keep democracy free, accurate, and accessible for everyone",
              images: ["https://whoisrunning.org/logo-transparent.png"],
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
            ...(isRecurring && {
              recurring: {
                interval: "month",
              },
            }),
          },
          quantity: 1,
        },
      ],
      mode: isRecurring ? "subscription" : "payment",
      success_url: `${request.headers.get("origin")}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get("origin")}/#chip-in`,
      metadata: {
        contributorType: isRecurring ? "monthly" : "one-time",
      },
    };

    const session = await stripe.checkout.sessions.create(params);

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: "Payment creation failed" },
      { status: 500 }
    );
  }
}
```

## Step 5: Update ChipInSection Component

Replace the placeholder payment handler in `/components/features/support/ChipInSection.tsx`:

```typescript
"use client";

import { loadStripe } from "@stripe/stripe-js";
// ... other imports

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export function ChipInSection() {
  // ... existing state

  const [processing, setProcessing] = useState(false);

  const handleChipIn = async () => {
    if (!selectedAmount || selectedAmount <= 0) return;

    setProcessing(true);

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

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe!.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Stripe redirect error:", error);
        alert("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // Update the button:
  <Button
    size="lg"
    onClick={handleChipIn}
    disabled={!selectedAmount || selectedAmount <= 0 || processing}
    className="bg-white text-blue-600 hover:bg-blue-50 font-bold text-lg px-8 py-6"
  >
    {processing
      ? "Processing..."
      : isRecurring
      ? "Chip In Monthly"
      : "Chip In Once"}
    {selectedAmount && selectedAmount > 0 && !processing && (
      <span className="ml-2">${selectedAmount}</span>
    )}
  </Button>
}
```

## Step 6: Create Success Page

Create `/app/payment/success/page.tsx`:

```typescript
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Heart } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl bg-white rounded-lg shadow-xl p-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Thank You! 🎉
        </h1>
        <p className="text-xl text-gray-700 mb-6">
          Your contribution helps keep democracy free, accurate, and accessible
          for everyone.
        </p>
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <Heart className="h-8 w-8 text-red-500 mx-auto mb-3" />
          <p className="text-gray-700 mb-2">
            You&apos;ve just helped thousands of voters make informed decisions.
          </p>
          <p className="text-sm text-gray-600">
            A receipt has been sent to your email.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/">Return Home</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/contributors">See All Contributors</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
```

## Step 7: Set Up Stripe Webhook (Track Payments)

1. **In Stripe Dashboard:**
   - Go to Developers → Webhooks
   - Click "+ Add endpoint"
   - URL: `https://whoisrunning.org/api/webhooks/stripe`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`

2. **Create webhook endpoint** at `/app/api/webhooks/stripe/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;

      // TODO: Save to database
      console.log("Payment successful:", {
        amount: session.amount_total! / 100,
        email: session.customer_email,
        isRecurring: session.mode === "subscription",
      });

      // TODO: Send thank you email
      // TODO: Add to Contributors page
      break;

    case "customer.subscription.deleted":
      // Handle subscription cancellation
      console.log("Subscription cancelled");
      break;

    case "invoice.payment_succeeded":
      // Handle recurring payment
      console.log("Recurring payment succeeded");
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
```

3. **Test webhook locally:**
```bash
# Install Stripe CLI
brew install stripe/stripe-brew/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Get webhook secret from output, add to .env.local
```

## Step 8: Database Schema (Supabase/Postgres)

Create `contributions` table:

```sql
CREATE TABLE contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255),
  name VARCHAR(100),
  location VARCHAR(100),
  amount DECIMAL(10, 2) NOT NULL,
  is_recurring BOOLEAN DEFAULT false,
  stripe_customer_id VARCHAR(255),
  stripe_session_id VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  opted_in_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_contributions_created ON contributions(created_at DESC);
CREATE INDEX idx_contributions_public ON contributions(opted_in_public, created_at DESC);
```

## Step 9: Dynamic Contributor Stats

Update `/app/contributors/page.tsx` to fetch from database:

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function ContributorsPage() {
  const supabase = createClient()

  // Get stats
  const { data: stats } = await supabase
    .from('contributions')
    .select('amount, is_recurring')

  const monthlyTotal = stats?.length || 0
  const totalRaised = stats?.reduce((sum, c) => sum + Number(c.amount), 0) || 0

  // Get public contributors
  const { data: recentContributors } = await supabase
    .from('contributions')
    .select('name, location, amount, is_recurring, created_at')
    .eq('opted_in_public', true)
    .order('created_at', { ascending: false })
    .limit(10)

  // ... rest of page
}
```

## Step 10: Testing

### Test Mode (Use test cards):
```
Card: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

### Test scenarios:
1. One-time payment of $15
2. Monthly subscription of $50
3. Custom amount of $7
4. Payment failure (card: 4000 0000 0000 0002)
5. Subscription cancellation

## Step 11: Go Live

1. **Switch to live keys** in Vercel:
   - Get live keys from Stripe Dashboard
   - Update environment variables
   - Redeploy

2. **Verify webhook** is pointing to production URL

3. **Test with real card** (small amount first!)

4. **Monitor Stripe Dashboard** for:
   - Successful payments
   - Failed payments
   - Subscription renewals

## Optional Enhancements

### Email Receipts (Resend)
```bash
npm install resend
```

### Thank You Emails
- Triggered by webhook
- Include contribution amount
- Link to Contributors page opt-in

### Admin Dashboard
- View all contributions
- Export for tax purposes
- Manually add offline contributions

### Contribution Tiers
- Bronze: $5-14/month
- Silver: $15-49/month
- Gold: $50+/month

---

## Support

**Stripe Docs:** https://stripe.com/docs/payments/checkout
**Stripe Next.js Guide:** https://github.com/stripe-samples/nextjs-typescript-react-stripe-js

**Issues?** Check Stripe Dashboard logs for detailed error messages.

---

## Estimated Development Time

- **Basic Integration:** 2-4 hours
- **With Database:** 4-6 hours
- **With Emails:** 6-8 hours
- **Full Admin Dashboard:** 12-16 hours

---

## Monthly Costs

- **Stripe:** 2.9% + $0.30 per transaction
- **Database (Supabase):** Free tier (up to 500MB)
- **Email (Resend):** Free tier (3,000 emails/month)

**Example:** $1000/month revenue = ~$30 in fees

---

**Ready to integrate? Start with Step 1!** 🚀
