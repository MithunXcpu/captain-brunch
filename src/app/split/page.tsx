"use client";

import { useState } from "react";
import Link from "next/link";

interface Person {
  id: string;
  name: string;
  amount: number;
  paid: boolean;
  cardLast4?: string;
}

export default function SplitPage() {
  const [step, setStep] = useState<"bill" | "people" | "pay">("bill");
  const [billTotal, setBillTotal] = useState("");
  const [tip, setTip] = useState(20);
  const [people, setPeople] = useState<Person[]>([
    { id: "1", name: "You", amount: 0, paid: false },
  ]);
  const [newPersonName, setNewPersonName] = useState("");
  const [splitType, setSplitType] = useState<"equal" | "custom">("equal");
  const [processing, setProcessing] = useState(false);
  const [complete, setComplete] = useState(false);

  const totalWithTip = parseFloat(billTotal || "0") * (1 + tip / 100);
  const perPerson = people.length > 0 ? totalWithTip / people.length : 0;

  const addPerson = () => {
    if (!newPersonName.trim()) return;
    setPeople([
      ...people,
      {
        id: Date.now().toString(),
        name: newPersonName,
        amount: splitType === "equal" ? perPerson : 0,
        paid: false,
      },
    ]);
    setNewPersonName("");
  };

  const removePerson = (id: string) => {
    if (people.length <= 1) return;
    setPeople(people.filter((p) => p.id !== id));
  };

  const handlePay = async () => {
    setProcessing(true);
    // Simulate payment processing
    for (let i = 0; i < people.length; i++) {
      await new Promise((r) => setTimeout(r, 800));
      setPeople((prev) =>
        prev.map((p, idx) =>
          idx === i ? { ...p, paid: true, cardLast4: String(1000 + Math.floor(Math.random() * 9000)) } : p
        )
      );
    }
    setProcessing(false);
    setComplete(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 px-4 md:px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
              <span className="text-lg">🍳</span>
            </div>
            <span className="text-xl font-bold">Captain Brunch</span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span className={step === "bill" ? "text-orange-400" : ""}>Bill</span>
            <span>→</span>
            <span className={step === "people" ? "text-orange-400" : ""}>People</span>
            <span>→</span>
            <span className={step === "pay" ? "text-orange-400" : ""}>Pay</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 md:px-6 py-8">
        {/* Step 1: Bill */}
        {step === "bill" && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">What&apos;s the bill?</h1>
              <p className="text-zinc-400">Enter the total before tip</p>
            </div>

            {/* Bill Amount */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <label className="block text-sm text-zinc-400 mb-2">Bill Total</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl text-zinc-500">$</span>
                <input
                  type="number"
                  value={billTotal}
                  onChange={(e) => setBillTotal(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-12 pr-4 py-4 bg-zinc-800 border border-zinc-700 rounded-xl text-3xl font-bold focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            {/* Tip */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <label className="block text-sm text-zinc-400 mb-4">Tip</label>
              <div className="flex gap-2">
                {[15, 18, 20, 25].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTip(t)}
                    className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                      tip === t
                        ? "bg-orange-500 text-white"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                    }`}
                  >
                    {t}%
                  </button>
                ))}
              </div>
              {billTotal && (
                <p className="mt-4 text-center text-zinc-400">
                  Tip: ${(parseFloat(billTotal) * (tip / 100)).toFixed(2)}
                </p>
              )}
            </div>

            {/* Total */}
            {billTotal && (
              <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/30 rounded-2xl p-6 text-center">
                <p className="text-zinc-400 text-sm mb-1">Total with tip</p>
                <p className="text-4xl font-bold text-orange-400">${totalWithTip.toFixed(2)}</p>
              </div>
            )}

            <button
              onClick={() => setStep("people")}
              disabled={!billTotal || parseFloat(billTotal) <= 0}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Add People
            </button>
          </div>
        )}

        {/* Step 2: People */}
        {step === "people" && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Who&apos;s splitting?</h1>
              <p className="text-zinc-400">Add everyone at the table</p>
            </div>

            {/* Split Type */}
            <div className="flex bg-zinc-900 rounded-xl p-1">
              <button
                onClick={() => setSplitType("equal")}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  splitType === "equal" ? "bg-orange-500 text-white" : "text-zinc-400"
                }`}
              >
                Split Equally
              </button>
              <button
                onClick={() => setSplitType("custom")}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  splitType === "custom" ? "bg-orange-500 text-white" : "text-zinc-400"
                }`}
              >
                Custom Split
              </button>
            </div>

            {/* People List */}
            <div className="space-y-3">
              {people.map((person, index) => (
                <div
                  key={person.id}
                  className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center font-bold">
                    {person.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{person.name}</p>
                    {index === 0 && <p className="text-xs text-zinc-500">Organizer</p>}
                  </div>
                  <p className="font-bold text-orange-400">${perPerson.toFixed(2)}</p>
                  {index > 0 && (
                    <button
                      onClick={() => removePerson(person.id)}
                      className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Person */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
                placeholder="Add person's name"
                className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500"
                onKeyDown={(e) => e.key === "Enter" && addPerson()}
              />
              <button
                onClick={addPerson}
                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors"
              >
                Add
              </button>
            </div>

            {/* Share Link */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <p className="text-sm text-zinc-400 mb-2">Or share link to invite</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`captainbrunch.app/join/abc123`}
                  readOnly
                  className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-400"
                />
                <button
                  onClick={() => navigator.clipboard.writeText("https://captainbrunch.app/join/abc123")}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/30 rounded-2xl p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-zinc-400 text-sm">Total</p>
                  <p className="text-2xl font-bold">${totalWithTip.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-zinc-400 text-sm">Per person</p>
                  <p className="text-2xl font-bold text-orange-400">${perPerson.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("bill")}
                className="px-6 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-medium"
              >
                Back
              </button>
              <button
                onClick={() => setStep("pay")}
                className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Next: Pay
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Pay */}
        {step === "pay" && !complete && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Ready to pay</h1>
              <p className="text-zinc-400">Everyone pays at once</p>
            </div>

            {/* Virtual Card */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm h-48 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-6 shadow-2xl shadow-orange-500/20">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-orange-200 text-xs uppercase tracking-wider">Virtual Card</p>
                    <p className="text-white font-bold text-lg">Captain Brunch</p>
                  </div>
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xl">🍳</span>
                  </div>
                </div>
                <p className="text-white font-mono text-lg tracking-widest mb-4">
                  •••• •••• •••• {Math.floor(1000 + Math.random() * 9000)}
                </p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-orange-200 text-xs">Collecting</p>
                    <p className="text-white font-bold">${totalWithTip.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-200 text-xs">From</p>
                    <p className="text-white font-bold">{people.length} people</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className="space-y-3">
              {people.map((person) => (
                <div
                  key={person.id}
                  className={`flex items-center gap-4 bg-zinc-900 border rounded-xl p-4 transition-colors ${
                    person.paid ? "border-green-500/50" : "border-zinc-800"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    person.paid
                      ? "bg-green-500"
                      : "bg-gradient-to-br from-orange-400 to-amber-500"
                  }`}>
                    {person.paid ? (
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      person.name[0].toUpperCase()
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{person.name}</p>
                    <p className="text-xs text-zinc-500">
                      {person.paid ? `Paid with •••• ${person.cardLast4}` : "Waiting..."}
                    </p>
                  </div>
                  <p className={`font-bold ${person.paid ? "text-green-400" : "text-orange-400"}`}>
                    ${perPerson.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={handlePay}
              disabled={processing}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Collect & Pay
                </>
              )}
            </button>
          </div>
        )}

        {/* Complete */}
        {complete && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">All paid!</h1>
            <p className="text-zinc-400 mb-8">
              ${totalWithTip.toFixed(2)} split between {people.length} people
            </p>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
              <p className="text-zinc-400 text-sm mb-4">Receipt sent to everyone</p>
              <div className="flex flex-wrap justify-center gap-2">
                {people.map((person) => (
                  <div
                    key={person.id}
                    className="px-4 py-2 bg-zinc-800 rounded-full text-sm"
                  >
                    {person.name}: ${perPerson.toFixed(2)}
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl font-semibold hover:opacity-90"
            >
              Start New Split
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
