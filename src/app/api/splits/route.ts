import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  validateAmount,
  validatePercentage,
  validateParticipants,
  sanitizeString,
} from "@/lib/validation";

// GET /api/splits - List user's splits
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      const clerkUser = await currentUser();
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser?.emailAddresses?.[0]?.emailAddress,
          phone: clerkUser?.phoneNumbers?.[0]?.phoneNumber,
          name: clerkUser?.firstName
            ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
            : undefined,
        },
      });
    }

    const splits = await prisma.split.findMany({
      where: { creatorId: user.id },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            amount: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100, // Limit results for safety
    });

    return NextResponse.json({ splits });
  } catch (error) {
    console.error("Failed to fetch splits:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// POST /api/splits - Create a new split
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

    // Validate all inputs
    const billAmount = validateAmount(body.billAmount);
    if (billAmount === null || billAmount <= 0) {
      return NextResponse.json({ error: "Invalid bill amount" }, { status: 400 });
    }

    const tipPercentage = validatePercentage(body.tipPercentage) ?? 20;
    const platformFee = validatePercentage(body.platformFee) ?? 0;
    const restaurantName = sanitizeString(body.restaurantName);

    const participants = validateParticipants(body.participants);
    if (!participants) {
      return NextResponse.json(
        { error: "Invalid participants data" },
        { status: 400 }
      );
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      const clerkUser = await currentUser();
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser?.emailAddresses?.[0]?.emailAddress,
          phone: clerkUser?.phoneNumbers?.[0]?.phoneNumber,
          name: clerkUser?.firstName
            ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
            : undefined,
        },
      });
    }

    // Calculate totals
    const tipAmount = billAmount * (tipPercentage / 100);
    const feeAmount = billAmount * (platformFee / 100);
    const totalAmount = billAmount + tipAmount + feeAmount;

    // Use custom amounts if provided, otherwise equal split
    const hasCustomAmounts = participants.some((p) => p.amount !== undefined);

    // Create split with participants
    const split = await prisma.split.create({
      data: {
        creatorId: user.id,
        billAmount: billAmount,
        tipPercentage: Math.round(tipPercentage),
        totalAmount: totalAmount,
        restaurantName: restaurantName || null,
        participants: {
          create: participants.map((p) => ({
            name: p.name,
            phone: p.phone || null,
            amount: hasCustomAmounts && p.amount !== undefined
              ? p.amount
              : totalAmount / participants.length,
            userId: p.name === user!.name ? user!.id : undefined,
          })),
        },
      },
      include: {
        participants: true,
      },
    });

    return NextResponse.json({
      split,
      shareLink: `${process.env.NEXT_PUBLIC_APP_URL || "https://caption-brunch.vercel.app"}/join/${split.shareCode}`,
    });
  } catch (error) {
    console.error("Failed to create split:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
