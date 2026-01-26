import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { validateId, sanitizeString } from "@/lib/validation";

// POST /api/splits/[id]/pay - Create Stripe checkout session
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = validateId(rawId);

    if (!id) {
      return NextResponse.json({ error: "Invalid split ID" }, { status: 400 });
    }

    // Parse and validate request body
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const participantId = validateId(body.participantId);
    if (!participantId) {
      return NextResponse.json({ error: "Invalid participant ID" }, { status: 400 });
    }

    const split = await prisma.split.findFirst({
      where: {
        OR: [{ id }, { shareCode: id }],
      },
      include: {
        participants: true,
        creator: true,
      },
    });

    if (!split) {
      return NextResponse.json({ error: "Split not found" }, { status: 404 });
    }

    const participant = split.participants.find((p) => p.id === participantId);
    if (!participant) {
      return NextResponse.json({ error: "Participant not found" }, { status: 404 });
    }

    if (participant.status === "PAID") {
      return NextResponse.json({ error: "Already paid" }, { status: 400 });
    }

    // Validate amount is reasonable
    const amount = Number(participant.amount);
    if (isNaN(amount) || amount <= 0 || amount > 100000) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://caption-brunch.vercel.app";
    const productName = sanitizeString(split.restaurantName) || "Bill Split";
    const participantName = sanitizeString(participant.name);

    // Create Stripe Checkout session
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Split: ${productName}`,
              description: `Your share of the bill (${participantName})`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/split/success?session_id={CHECKOUT_SESSION_ID}&split_id=${split.id}&participant_id=${participant.id}`,
      cancel_url: `${appUrl}/join/${split.shareCode}?cancelled=true`,
      metadata: {
        splitId: split.id,
        participantId: participant.id,
      },
    });

    // Update participant with payment intent
    await prisma.splitParticipant.update({
      where: { id: participant.id },
      data: { paymentIntentId: session.payment_intent as string },
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Failed to create payment session:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
