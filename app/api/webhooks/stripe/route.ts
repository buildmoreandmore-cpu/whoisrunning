import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    console.error("No stripe signature found");
    return NextResponse.json(
      { error: "No signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Note: STRIPE_WEBHOOK_SECRET should be set after creating webhook in Stripe Dashboard
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      // For now, just parse the event without verification (development only)
      console.warn("No webhook secret configured - skipping verification");
      event = JSON.parse(body);
    } else {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    }
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;

        const amount = session.amount_total ? session.amount_total / 100 : 0;
        const isRecurring = session.mode === "subscription";

        console.log("💰 Payment successful:", {
          sessionId: session.id,
          amount,
          email: session.customer_email,
          isRecurring,
          customerId: session.customer,
          subscriptionId: session.subscription,
        });

        // Save to database
        try {
          const { data, error } = await supabase
            .from("contributions")
            .insert({
              email: session.customer_email,
              amount,
              is_recurring: isRecurring,
              stripe_customer_id: session.customer as string,
              stripe_session_id: session.id,
              stripe_subscription_id: session.subscription as string | null,
              status: "active",
              opted_in_public: false, // User can opt in later via email
            });

          if (error) {
            console.error("Error saving contribution to database:", error);
          } else {
            console.log("✅ Contribution saved to database");
          }
        } catch (dbError) {
          console.error("Database error:", dbError);
        }

        // TODO: Send thank you email with opt-in link
        // TODO: Update real-time stats

        break;

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object as Stripe.Subscription;

        console.log("❌ Subscription cancelled:", {
          subscriptionId: deletedSubscription.id,
          customerId: deletedSubscription.customer,
        });

        // TODO: Update database
        // - Mark subscription as cancelled
        // - Send cancellation confirmation email

        break;

      case "invoice.payment_succeeded":
        const invoice = event.data.object as Stripe.Invoice;

        console.log("🔄 Recurring payment succeeded:", {
          invoiceId: invoice.id,
          amount: invoice.amount_paid / 100,
          customerId: typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id,
        });

        // TODO: Update database
        // - Record recurring payment
        // - Update total contributions
        // - Send receipt email

        break;

      case "invoice.payment_failed":
        const failedInvoice = event.data.object as Stripe.Invoice;

        console.log("⚠️ Recurring payment failed:", {
          invoiceId: failedInvoice.id,
          customerId: failedInvoice.customer,
        });

        // TODO: Handle failed payment
        // - Send payment failed notification
        // - Update subscription status

        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
