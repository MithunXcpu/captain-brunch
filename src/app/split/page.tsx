"use client";

import { useState, useEffect } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

interface Person {
  id: string;
  name: string;
  phone?: string;
  amount: number;
  customAmount: boolean;
}

const TIP_PERCENTAGE = 15;
const PLATFORM_FEE_PERCENTAGE = 0.1;

export default function SplitPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [step, setStep] = useState<"bill" | "people" | "review" | "card">("bill");
  const [billTotal, setBillTotal] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [people, setPeople] = useState<Person[]>([]);
  const [newPersonName, setNewPersonName] = useState("");
  const [newPersonPhone, setNewPersonPhone] = useState("");
  const [creating, setCreating] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [splitId, setSplitId] = useState<string | null>(null);

  // Calculate amounts
  const subtotal = parseFloat(billTotal || "0");
  const tipAmount = subtotal * (TIP_PERCENTAGE / 100);
  const platformFee = subtotal * (PLATFORM_FEE_PERCENTAGE / 100);
  const totalAmount = subtotal + tipAmount + platformFee;

  // Calculate per-person amounts
  const customTotal = people.filter(p => p.customAmount).reduce((sum, p) => sum + p.amount, 0);
  const remainingAmount = totalAmount - customTotal;
  const equalSplitPeople = people.filter(p => !p.customAmount);
  const equalShare = equalSplitPeople.length > 0 ? remainingAmount / equalSplitPeople.length : 0;

  // Update equal split amounts
  useEffect(() => {
    if (people.length > 0 && totalAmount > 0) {
      setPeople(prev => prev.map(p =>
        p.customAmount ? p : { ...p, amount: equalShare }
      ));
    }
  }, [totalAmount, people.length, equalShare]);

  const addPerson = () => {
    if (!newPersonName.trim()) return;
    setPeople([
      ...people,
      {
        id: Date.now().toString(),
        name: newPersonName,
        phone: newPersonPhone || undefined,
        amount: equalShare || 0,
        customAmount: false,
      },
    ]);
    setNewPersonName("");
    setNewPersonPhone("");
  };

  const removePerson = (id: string) => {
    setPeople(people.filter((p) => p.id !== id));
  };

  const setCustomAmount = (id: string, amount: number) => {
    setPeople(people.map(p =>
      p.id === id ? { ...p, amount, customAmount: true } : p
    ));
  };

  const resetToEqual = (id: string) => {
    setPeople(people.map(p =>
      p.id === id ? { ...p, customAmount: false } : p
    ));
  };

  const createSplit = async () => {
    setCreating(true);

    try {
      // Create split in database
      const res = await fetch("/api/splits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billAmount: subtotal,
          tipPercentage: TIP_PERCENTAGE,
          platformFee: PLATFORM_FEE_PERCENTAGE,
          restaurantName: restaurantName || undefined,
          participants: people.map((p) => ({
            name: p.name,
            phone: p.phone,
            amount: p.customAmount ? p.amount : equalShare
          })),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create split");
      }

      const data = await res.json();
      setShareLink(data.shareLink);
      setSplitId(data.split?.id);
      setStep("card");
    } catch (error) {
      console.error("Failed to create split:", error);
      alert(error instanceof Error ? error.message : "Failed to create split. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const copyShareLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      alert("Link copied! Share it with your friends.");
    }
  };

  const stepIndex = step === "bill" ? 0 : step === "people" ? 1 : step === "review" ? 2 : 3;

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-espresso text-cream grain flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-burgundy/30 flex items-center justify-center animate-pulse">
          <span className="text-3xl">🍳</span>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-espresso text-cream grain flex flex-col">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-burgundy/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-mustard/5 rounded-full blur-3xl" />
        </div>

        <header className="relative border-b border-cream/10 px-4 md:px-6 py-4">
          <div className="max-w-2xl mx-auto">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-burgundy to-burgundy-light flex items-center justify-center shadow-lg shadow-burgundy/20 group-hover:scale-105 transition-transform">
                <span className="text-lg">🍳</span>
              </div>
              <span className="text-lg font-display font-semibold">Captain Brunch</span>
            </Link>
          </div>
        </header>

        <main className="relative flex-1 flex items-center justify-center px-4 py-12">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-burgundy/30 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🔐</span>
            </div>
            <h1 className="text-3xl font-display font-bold mb-3">Sign in to split</h1>
            <p className="text-cream/60 mb-8">Create an account to start splitting bills with friends.</p>
            <SignInButton mode="modal">
              <button className="btn-mustard px-8 py-4 rounded-xl font-semibold text-lg">
                Sign In
              </button>
            </SignInButton>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-espresso text-cream grain">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-burgundy/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-mustard/5 rounded-full blur-3xl" />
      </div>

      <header className="relative border-b border-cream/10 px-4 md:px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-burgundy to-burgundy-light flex items-center justify-center shadow-lg shadow-burgundy/20 group-hover:scale-105 transition-transform">
              <span className="text-lg">🍳</span>
            </div>
            <span className="text-lg font-display font-semibold">Captain Brunch</span>
          </Link>

          <div className="flex items-center gap-1.5">
            {["Bill", "People", "Review", "Share"].map((label, idx) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                  idx === stepIndex
                    ? "bg-mustard/20 text-mustard"
                    : idx < stepIndex
                    ? "text-sage"
                    : "text-cream/40"
                }`}>
                  {idx < stepIndex && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {label}
                </div>
                {idx < 3 && (
                  <div className={`w-4 h-px ${idx < stepIndex ? "bg-sage" : "bg-cream/20"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="relative max-w-2xl mx-auto px-4 md:px-6 py-8">
        {/* Step 1: Bill */}
        {step === "bill" && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">Enter the bill</h1>
              <p className="text-cream/50">We&apos;ll add {TIP_PERCENTAGE}% tip + {PLATFORM_FEE_PERCENTAGE}% fee</p>
            </div>

            <div className="retro-card rounded-2xl p-6">
              <label className="block text-sm text-cream/50 mb-3 uppercase tracking-wider">Restaurant (optional)</label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="e.g. The Breakfast Club"
                className="w-full px-5 py-4 retro-input rounded-xl"
              />
            </div>

            <div className="retro-card rounded-2xl p-6">
              <label className="block text-sm text-cream/50 mb-3 uppercase tracking-wider">Bill Subtotal</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-3xl text-cream/30 font-display">$</span>
                <input
                  type="number"
                  value={billTotal}
                  onChange={(e) => setBillTotal(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-14 pr-4 py-5 retro-input rounded-xl text-3xl font-display font-bold placeholder:text-cream/20"
                />
              </div>
            </div>

            {subtotal > 0 && (
              <div className="retro-card rounded-2xl p-6 space-y-3">
                <div className="flex justify-between text-cream/60">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-cream/60">
                  <span>Tip ({TIP_PERCENTAGE}%)</span>
                  <span>${tipAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-cream/60">
                  <span>Platform fee ({PLATFORM_FEE_PERCENTAGE}%)</span>
                  <span>${platformFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-cream/10 pt-3 flex justify-between font-display font-bold text-xl">
                  <span>Total</span>
                  <span className="text-mustard">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                if (people.length === 0 && user) {
                  const userName = user.firstName || "You";
                  setPeople([{ id: "self", name: userName, amount: 0, customAmount: false }]);
                }
                setStep("people");
              }}
              disabled={!billTotal || subtotal <= 0}
              className="w-full py-4 btn-mustard rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Add People
            </button>
          </div>
        )}

        {/* Step 2: People */}
        {step === "people" && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">Who&apos;s paying?</h1>
              <p className="text-cream/50">Add everyone and customize amounts</p>
            </div>

            <div className="space-y-3">
              {people.map((person, index) => (
                <div
                  key={person.id}
                  className="retro-card rounded-xl p-4"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-burgundy to-burgundy-light flex items-center justify-center font-display font-bold text-lg shadow-lg shadow-burgundy/20">
                      {person.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{person.name}</p>
                      {index === 0 && <p className="text-xs text-mustard/70 uppercase tracking-wider">You</p>}
                    </div>
                    {index > 0 && (
                      <button
                        onClick={() => removePerson(person.id)}
                        className="p-2 hover:bg-burgundy/20 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5 text-cream/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/30">$</span>
                      <input
                        type="number"
                        value={person.customAmount ? person.amount.toFixed(2) : equalShare.toFixed(2)}
                        onChange={(e) => setCustomAmount(person.id, parseFloat(e.target.value) || 0)}
                        className="w-full pl-8 pr-3 py-2 bg-espresso border border-cream/10 rounded-lg text-right font-display font-bold"
                      />
                    </div>
                    {person.customAmount && (
                      <button
                        onClick={() => resetToEqual(person.id)}
                        className="px-3 py-2 text-xs text-mustard border border-mustard/30 rounded-lg hover:bg-mustard/10"
                      >
                        Equal
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="retro-card rounded-xl p-5 space-y-3">
              <p className="text-sm text-cream/50 uppercase tracking-wider">Add person</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                  placeholder="Name"
                  className="flex-1 px-4 py-3 retro-input rounded-lg"
                  onKeyDown={(e) => e.key === "Enter" && addPerson()}
                />
                <button
                  onClick={addPerson}
                  disabled={!newPersonName.trim()}
                  className="px-5 py-3 bg-espresso border border-cream/10 hover:border-mustard/50 rounded-lg font-medium transition-all disabled:opacity-50"
                >
                  Add
                </button>
              </div>
              <input
                type="tel"
                value={newPersonPhone}
                onChange={(e) => setNewPersonPhone(e.target.value)}
                placeholder="Phone (optional - for payment reminders)"
                className="w-full px-4 py-3 retro-input rounded-lg"
              />
            </div>

            <div className="retro-card rounded-2xl p-6">
              <div className="flex justify-between items-center">
                <span className="text-cream/60">Total to collect</span>
                <span className="text-2xl font-display font-bold text-mustard">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-cream/60">Split between</span>
                <span className="font-medium">{people.length} {people.length === 1 ? 'person' : 'people'}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("bill")}
                className="px-6 py-4 bg-espresso-light border border-cream/10 hover:border-cream/20 rounded-xl font-medium"
              >
                Back
              </button>
              <button
                onClick={() => setStep("review")}
                disabled={people.length < 1}
                className="flex-1 py-4 btn-mustard rounded-xl font-semibold text-lg disabled:opacity-50"
              >
                Review Split
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === "review" && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">Review & Generate Card</h1>
              <p className="text-cream/50">Confirm the split before generating your virtual card</p>
            </div>

            <div className="retro-card rounded-2xl p-6">
              <h2 className="font-display font-semibold text-lg mb-4">
                {restaurantName || "Bill Split"}
              </h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-cream/60">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-cream/60">
                  <span>Tip ({TIP_PERCENTAGE}%)</span>
                  <span>${tipAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-cream/60">
                  <span>Platform fee ({PLATFORM_FEE_PERCENTAGE}%)</span>
                  <span>${platformFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-cream/10 pt-2 flex justify-between font-display font-bold text-lg">
                  <span>Total</span>
                  <span className="text-mustard">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="retro-card rounded-2xl p-6">
              <h2 className="font-display font-semibold text-lg mb-4">Payment Breakdown</h2>
              <div className="space-y-3">
                {people.map((person) => (
                  <div key={person.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-burgundy/30 flex items-center justify-center font-display font-bold text-sm">
                        {person.name[0].toUpperCase()}
                      </div>
                      <span>{person.name}</span>
                    </div>
                    <span className="font-display font-bold text-mustard">
                      ${(person.customAmount ? person.amount : equalShare).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="retro-card rounded-2xl p-6 bg-gradient-to-r from-burgundy/20 to-burgundy/10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-mustard/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-mustard" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display font-semibold">How it works</h3>
                  <p className="text-cream/60 text-sm mt-1">
                    Pay the restaurant with your card. We&apos;ll create a share link so your friends can pay you back ${totalAmount.toFixed(2)} total via card.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("people")}
                className="px-6 py-4 bg-espresso-light border border-cream/10 hover:border-cream/20 rounded-xl font-medium"
              >
                Back
              </button>
              <button
                onClick={createSplit}
                disabled={creating}
                className="flex-1 py-4 btn-mustard rounded-xl font-semibold text-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {creating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-espresso border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Create Split
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Share & Collect */}
        {step === "card" && shareLink && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">Split Created!</h1>
              <p className="text-cream/50">Share the link below so your friends can pay you back</p>
            </div>

            {/* Share Link Card */}
            <div className="retro-card rounded-2xl p-6 bg-gradient-to-r from-mustard/10 to-mustard/5">
              <p className="text-sm text-cream/50 mb-3 uppercase tracking-wider">Payment Link</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 px-4 py-3 bg-espresso border border-cream/10 rounded-lg text-sm text-cream"
                />
                <button
                  onClick={copyShareLink}
                  className="px-5 py-3 btn-mustard rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
              </div>
              <p className="text-xs text-cream/40 mt-3">
                Friends click this link → pay with their card → money goes to you
              </p>
            </div>

            {/* Quick Share Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const text = `Hey! Here's the link to pay your share: ${shareLink}`;
                  window.open(`sms:?body=${encodeURIComponent(text)}`, '_blank');
                }}
                className="flex-1 py-4 bg-espresso-light border border-cream/10 hover:border-cream/20 rounded-xl font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Text
              </button>
              <button
                onClick={() => {
                  const text = `Split the bill: ${shareLink}`;
                  if (navigator.share) {
                    navigator.share({ title: 'Pay your share', text, url: shareLink });
                  } else {
                    navigator.clipboard.writeText(shareLink);
                    alert('Link copied!');
                  }
                }}
                className="flex-1 py-4 bg-espresso-light border border-cream/10 hover:border-cream/20 rounded-xl font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>

            {/* Summary */}
            <div className="retro-card rounded-2xl p-6">
              <h2 className="font-display font-semibold text-lg mb-4">Who owes what</h2>
              <div className="space-y-3">
                {people.map((person, idx) => (
                  <div key={person.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-burgundy/30 flex items-center justify-center font-display font-bold text-sm">
                        {person.name[0].toUpperCase()}
                      </div>
                      <span>{person.name}</span>
                      {idx === 0 && <span className="text-xs text-mustard/70">(You)</span>}
                    </div>
                    <span className="font-display font-bold text-mustard">
                      ${(person.customAmount ? person.amount : equalShare).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-cream/10 mt-4 pt-4 flex justify-between font-display font-bold text-lg">
                <span>Total to collect</span>
                <span className="text-mustard">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="retro-card rounded-xl p-4 bg-burgundy/10 border border-burgundy/20">
              <p className="text-sm text-cream/70">
                <strong className="text-cream">Next step:</strong> Pay the restaurant with your own card. Your friends will pay you back through the link above.
              </p>
            </div>

            <Link
              href="/"
              className="block w-full py-4 btn-mustard rounded-xl font-semibold text-lg text-center"
            >
              Done
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
