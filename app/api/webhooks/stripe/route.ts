import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

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

        console.log("💰 Payment successful:", {
          sessionId: session.id,
          amount: session.amount_total ? session.amount_total / 100 : 0,
          email: session.customer_email,
          isRecurring: session.mode === "subscription",
          customerId: session.customer,
          subscriptionId: session.subscription,
        });

        // TODO: Save to database
        // - Store contribution record
        // - Send thank you email
        // - Update contributor count
        // - Add to Contributors page (if opted in)

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
