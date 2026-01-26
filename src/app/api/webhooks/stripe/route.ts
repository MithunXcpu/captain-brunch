import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import prisma from "@/lib/db";
import { getStripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const { splitId, participantId } = session.metadata || {};

        if (splitId && participantId) {
          // Mark participant as paid
          await prisma.splitParticipant.update({
            where: { id: participantId },
            data: {
              status: "PAID",
              paidAt: new Date(),
              paymentIntentId: session.payment_intent as string,
            },
          });

          // Check if all participants have paid
          const split = await prisma.split.findUnique({
            where: { id: splitId },
            include: { participants: true },
          });

          if (split) {
            const allPaid = split.participants.every((p) => p.status === "PAID");
            if (allPaid) {
              await prisma.split.update({
                where: { id: splitId },
                data: { status: "COMPLETED" },
              });
            } else {
              await prisma.split.update({
                where: { id: splitId },
                data: { status: "COLLECTING" },
              });
            }
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        // Find and update participant
        const participant = await prisma.splitParticipant.findFirst({
          where: { paymentIntentId: paymentIntent.id },
        });

        if (participant) {
          await prisma.splitParticipant.update({
            where: { id: participant.id },
            data: { status: "FAILED" },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
