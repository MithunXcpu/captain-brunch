import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sendSMS } from "@/lib/twilio";
import { validateId, sanitizeString } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const splitId = validateId(body.splitId);
    const participantId = validateId(body.participantId);

    if (!splitId || !participantId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Verify user owns this split
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const split = await prisma.split.findUnique({
      where: { id: splitId },
      include: {
        participants: true,
        creator: true,
      },
    });

    if (!split) {
      return NextResponse.json({ error: "Split not found" }, { status: 404 });
    }

    // Only allow creator to send invites
    if (split.creatorId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const participant = split.participants.find((p) => p.id === participantId);
    if (!participant) {
      return NextResponse.json({ error: "Participant not found" }, { status: 404 });
    }

    if (!participant.phone) {
      return NextResponse.json({ error: "Participant has no phone number" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://caption-brunch.vercel.app";
    const shareLink = `${appUrl}/join/${split.shareCode}`;
    const amount = Number(participant.amount).toFixed(2);
    const creatorName = sanitizeString(split.creator.name) || "Someone";
    const restaurantPart = split.restaurantName
      ? ` at ${sanitizeString(split.restaurantName)}`
      : "";

    const message = `Hey ${sanitizeString(participant.name)}! ${creatorName} invited you to split a bill${restaurantPart}. Your share is $${amount}. Pay here: ${shareLink}`;

    const sid = await sendSMS(participant.phone, message);

    // Log the SMS
    await prisma.smsLog.create({
      data: {
        phone: participant.phone,
        message,
        twilioSid: sid,
        status: sid ? "sent" : "failed",
        splitId: split.id,
      },
    });

    // Update participant status
    await prisma.splitParticipant.update({
      where: { id: participantId },
      data: { status: "INVITED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send SMS:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
