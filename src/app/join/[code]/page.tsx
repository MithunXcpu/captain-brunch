"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loadStripe, PaymentRequest } from "@stripe/stripe-js";

interface Participant {
  id: string;
  name: string;
  amount: string;
  status: string;
  paidAt: string | null;
}

interface Split {
  id: string;
  billAmount: string;
  tipPercentage: number;
  totalAmount: string;
  restaurantName: string | null;
  status: string;
  creator: { id: string; name: string };
  participants: Participant[];
}

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

export default function JoinPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [split, setSplit] = useState<Split | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
  const [canMakePayment, setCanMakePayment] = useState<{ applePay?: boolean; googlePay?: boolean } | null>(null);

  const cancelled = searchParams.get("cancelled");

  useEffect(() => {
    async function fetchSplit() {
      try {
        const res = await fetch(`/api/splits/${params.code}`);
        if (!res.ok) throw new Error("Split not found");
        const data = await res.json();
        setSplit(data.split);
      } catch {
        setError("This split doesn't exist or has expired.");
      } finally {
        setLoading(false);
      }
    }
    fetchSplit();
  }, [params.code]);

  // Set up Apple Pay / Google Pay when participant is selected
  const selectedAmount = selectedParticipant && split
    ? Number(split.participants.find(p => p.id === selectedParticipant)?.amount || 0)
    : 0;

  useEffect(() => {
    if (!selectedParticipant || !split || selectedAmount <= 0) {
      setPaymentRequest(null);
      setCanMakePayment(null);
      return;
    }

    async function setupPaymentRequest() {
      const stripe = await stripePromise;
      if (!stripe) return;

      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: split!.restaurantName || "Bill Split",
          amount: Math.round(selectedAmount * 100),
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      const result = await pr.canMakePayment();
      if (result) {
        setPaymentRequest(pr);
        setCanMakePayment(result);
      } else {
        setPaymentRequest(null);
        setCanMakePayment(null);
      }
    }

    setupPaymentRequest();
  }, [selectedParticipant, split, selectedAmount]);

  const handlePay = useCallback(async () => {
    if (!selectedParticipant || !split) return;
    setPaying(true);

    try {
      const res = await fetch(`/api/splits/${split.id}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: selectedParticipant }),
      });

      if (!res.ok) throw new Error("Failed to create payment");

      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch {
      setError("Failed to process payment. Please try again.");
      setPaying(false);
    }
  }, [selectedParticipant, split]);

  // Handle Apple Pay / Google Pay
  const handleWalletPay = useCallback(async () => {
    if (!paymentRequest || !selectedParticipant || !split) return;

    // Show the payment sheet
    paymentRequest.show();

    paymentRequest.on("paymentmethod", async (ev) => {
      setPaying(true);
      try {
        // Create payment intent on server
        const res = await fetch(`/api/splits/${split.id}/pay`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            participantId: selectedParticipant,
            paymentMethodId: ev.paymentMethod.id,
          }),
        });

        if (!res.ok) {
          ev.complete("fail");
          throw new Error("Payment failed");
        }

        const data = await res.json();

        if (data.checkoutUrl) {
          // Fall back to checkout if we can't process directly
          ev.complete("success");
          window.location.href = data.checkoutUrl;
        } else {
          ev.complete("success");
          // Refresh to show paid status
          window.location.reload();
        }
      } catch {
        ev.complete("fail");
        setError("Payment failed. Please try again.");
        setPaying(false);
      }
    });
  }, [paymentRequest, selectedParticipant, split]);

  if (loading) {
    return (
      <div className="min-h-screen bg-espresso text-cream grain flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-burgundy/30 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-3xl">🍳</span>
          </div>
          <p className="text-cream/60">Loading split...</p>
        </div>
      </div>
    );
  }

  if (error || !split) {
    return (
      <div className="min-h-screen bg-espresso text-cream grain flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-burgundy/30 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">😕</span>
          </div>
          <h1 className="text-2xl font-display font-bold mb-3">Split Not Found</h1>
          <p className="text-cream/60 mb-8">{error}</p>
          <Link href="/" className="btn-mustard px-6 py-3 rounded-xl font-semibold inline-block">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const unpaidParticipants = split.participants.filter((p) => p.status !== "PAID");
  const paidParticipants = split.participants.filter((p) => p.status === "PAID");
  const allPaid = unpaidParticipants.length === 0;

  return (
    <div className="min-h-screen bg-espresso text-cream grain">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-burgundy/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-mustard/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-cream/10 px-4 md:px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-burgundy to-burgundy-light flex items-center justify-center shadow-lg shadow-burgundy/20 group-hover:scale-105 transition-transform">
              <span className="text-lg">🍳</span>
            </div>
            <span className="text-lg font-display font-semibold">Captain Brunch</span>
          </Link>
        </div>
      </header>

      <main className="relative max-w-lg mx-auto px-4 py-8">
        {cancelled && (
          <div className="mb-6 p-4 bg-burgundy/20 border border-burgundy/30 rounded-xl text-center">
            <p className="text-cream/80">Payment cancelled. You can try again below.</p>
          </div>
        )}

        {/* Split Card */}
        <div className="retro-card rounded-3xl p-6 mb-6">
          <div className="text-center mb-6">
            <p className="text-cream/50 text-sm uppercase tracking-wider mb-1">
              {split.restaurantName || "Bill Split"}
            </p>
            <p className="text-4xl font-display font-bold text-mustard">
              ${Number(split.totalAmount).toFixed(2)}
            </p>
            <p className="text-cream/40 text-sm mt-1">
              ${Number(split.billAmount).toFixed(2)} + {split.tipPercentage}% tip
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-cream/60 mb-6">
            <span>Split by</span>
            <span className="text-cream font-medium">{split.creator.name || "Someone"}</span>
          </div>

          {allPaid ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-sage rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-espresso" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-display font-bold mb-2">All Paid!</h2>
              <p className="text-cream/60">Everyone has paid their share.</p>
            </div>
          ) : (
            <>
              <div className="deco-divider text-cream/30 text-xs uppercase tracking-widest mb-6">
                Select your name to pay
              </div>

              <div className="space-y-3">
                {unpaidParticipants.map((participant) => (
                  <button
                    key={participant.id}
                    onClick={() => setSelectedParticipant(participant.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                      selectedParticipant === participant.id
                        ? "bg-mustard/10 border-mustard"
                        : "bg-espresso border-cream/10 hover:border-cream/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-burgundy/30 flex items-center justify-center font-display font-bold">
                        {participant.name[0]}
                      </div>
                      <span className="font-medium">{participant.name}</span>
                    </div>
                    <span className="font-display font-bold text-mustard">
                      ${Number(participant.amount).toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>

              {selectedParticipant && (
                <div className="mt-6 space-y-3">
                  {/* Apple Pay Button */}
                  {canMakePayment?.applePay && (
                    <button
                      onClick={handleWalletPay}
                      disabled={paying}
                      className="w-full py-4 bg-black text-white rounded-xl font-semibold text-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                      </svg>
                      Pay with Apple Pay
                    </button>
                  )}

                  {/* Google Pay Button */}
                  {canMakePayment?.googlePay && !canMakePayment?.applePay && (
                    <button
                      onClick={handleWalletPay}
                      disabled={paying}
                      className="w-full py-4 bg-white text-gray-800 rounded-xl font-semibold text-lg disabled:opacity-50 flex items-center justify-center gap-2 border border-gray-300"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Pay with Google Pay
                    </button>
                  )}

                  {/* Divider if wallet pay is available */}
                  {(canMakePayment?.applePay || canMakePayment?.googlePay) && (
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-px bg-cream/10" />
                      <span className="text-cream/40 text-sm">or</span>
                      <div className="flex-1 h-px bg-cream/10" />
                    </div>
                  )}

                  {/* Regular Pay Button */}
                  <button
                    onClick={handlePay}
                    disabled={paying}
                    className="w-full btn-mustard py-4 rounded-xl font-display font-bold text-lg disabled:opacity-50"
                  >
                    {paying ? "Processing..." : "Pay with Card"}
                  </button>
                </div>
              )}
            </>
          )}

          {paidParticipants.length > 0 && (
            <>
              <div className="deco-divider text-cream/30 text-xs uppercase tracking-widest my-6">
                Already Paid
              </div>
              <div className="space-y-2">
                {paidParticipants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-3 bg-sage/10 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center">
                        <svg className="w-4 h-4 text-espresso" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-cream/80">{participant.name}</span>
                    </div>
                    <span className="text-sage font-medium">
                      ${Number(participant.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <p className="text-center text-cream/40 text-sm">
          Secure payments powered by Stripe
        </p>
      </main>
    </div>
  );
}
