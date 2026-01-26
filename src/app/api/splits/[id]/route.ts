import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validateId, sanitizeString, validatePhoneNumber } from "@/lib/validation";

// GET /api/splits/[id] - Get split details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = validateId(rawId);

    if (!id) {
      return NextResponse.json({ error: "Invalid split ID" }, { status: 400 });
    }

    const split = await prisma.split.findFirst({
      where: {
        OR: [{ id }, { shareCode: id }],
      },
      include: {
        creator: {
          select: { id: true, name: true },
        },
        participants: {
          select: {
            id: true,
            name: true,
            // Don't expose full phone numbers for privacy
            amount: true,
            status: true,
            paidAt: true,
          },
        },
      },
    });

    if (!split) {
      return NextResponse.json({ error: "Split not found" }, { status: 404 });
    }

    return NextResponse.json({ split });
  } catch (error) {
    console.error("Failed to fetch split:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// POST /api/splits/[id]/join - Join a split
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
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

    const action = sanitizeString(body.action);
    const participantId = validateId(body.participantId);
    const name = sanitizeString(body.name);
    const phone = validatePhoneNumber(body.phone);

    const split = await prisma.split.findFirst({
      where: {
        OR: [{ id }, { shareCode: id }],
      },
      include: { participants: true },
    });

    if (!split) {
      return NextResponse.json({ error: "Split not found" }, { status: 404 });
    }

    // Handle different actions
    if (action === "join") {
      // Join as a new participant or claim existing
      if (participantId) {
        // Claim existing participant slot
        const participant = split.participants.find((p) => p.id === participantId);
        if (!participant) {
          return NextResponse.json({ error: "Participant not found" }, { status: 404 });
        }

        if (userId) {
          const user = await prisma.user.findUnique({ where: { clerkId: userId } });
          if (user) {
            await prisma.splitParticipant.update({
              where: { id: participantId },
              data: { userId: user.id, status: "JOINED" },
            });
          }
        } else {
          await prisma.splitParticipant.update({
            where: { id: participantId },
            data: { status: "JOINED" },
          });
        }
      } else if (name) {
        // Limit number of participants
        if (split.participants.length >= 50) {
          return NextResponse.json({ error: "Maximum participants reached" }, { status: 400 });
        }

        // Add new participant
        const shareAmount = split.totalAmount.div(split.participants.length + 1);

        // Recalculate all shares
        await prisma.$transaction([
          ...split.participants.map((p) =>
            prisma.splitParticipant.update({
              where: { id: p.id },
              data: { amount: shareAmount },
            })
          ),
          prisma.splitParticipant.create({
            data: {
              splitId: split.id,
              name,
              phone,
              amount: shareAmount,
              status: "JOINED",
            },
          }),
        ]);
      }

      // Fetch updated split
      const updatedSplit = await prisma.split.findUnique({
        where: { id: split.id },
        include: { participants: true },
      });

      return NextResponse.json({ split: updatedSplit });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Failed to join split:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
