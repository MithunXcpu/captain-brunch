"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const DEMO_STEPS = [
  { step: 1, title: "Bill entered", desc: "Sarah enters $127.50 bill at brunch" },
  { step: 2, title: "Friends added", desc: "Mike, Lisa, and James join the split" },
  { step: 3, title: "Everyone pays", desc: "Each person pays $38.25 instantly" },
  { step: 4, title: "Done!", desc: "Virtual card pays the restaurant" },
];

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % DEMO_STEPS.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 px-4 md:px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
              <span className="text-lg">🍳</span>
            </div>
            <span className="text-xl font-bold">Captain Brunch</span>
          </Link>
          <Link
            href="/split"
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm font-medium"
          >
            Try It Now
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">How it works</h1>
          <p className="text-zinc-400 text-lg">See a bill split in action</p>
        </div>

        {/* Demo Animation */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-12">
          {/* Progress */}
          <div className="flex justify-between mb-8">
            {DEMO_STEPS.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-colors ${
                    i <= currentStep
                      ? "bg-orange-500 text-white"
                      : "bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {i + 1}
                </div>
                <p className={`text-xs text-center hidden sm:block ${i <= currentStep ? "text-white" : "text-zinc-500"}`}>
                  {s.title}
                </p>
                {i < DEMO_STEPS.length - 1 && (
                  <div className="hidden sm:block absolute">
                    <div
                      className={`h-0.5 w-full transition-colors ${
                        i < currentStep ? "bg-orange-500" : "bg-zinc-700"
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Current Step Display */}
          <div className="text-center py-8">
            <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">
                {currentStep === 0 && "📝"}
                {currentStep === 1 && "👥"}
                {currentStep === 2 && "💳"}
                {currentStep === 3 && "✅"}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-2">{DEMO_STEPS[currentStep].title}</h2>
            <p className="text-zinc-400">{DEMO_STEPS[currentStep].desc}</p>
          </div>

          {/* Mock Phone */}
          <div className="flex justify-center">
            <div className="w-64 bg-zinc-800 rounded-3xl p-4 border-4 border-zinc-700">
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-zinc-400 text-xs">Bill Total</p>
                    <p className="text-3xl font-bold text-orange-400">$127.50</p>
                  </div>
                  <div className="text-center">
                    <p className="text-zinc-400 text-xs">With 20% tip</p>
                    <p className="text-xl font-bold">$153.00</p>
                  </div>
                </div>
              )}
              {currentStep === 1 && (
                <div className="space-y-2">
                  {["Sarah", "Mike", "Lisa", "James"].map((name, i) => (
                    <div key={name} className="flex items-center gap-3 bg-zinc-700 rounded-lg p-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-sm font-bold">
                        {name[0]}
                      </div>
                      <span className="text-sm">{name}</span>
                      {i === 0 && <span className="ml-auto text-xs text-orange-400">Host</span>}
                    </div>
                  ))}
                </div>
              )}
              {currentStep === 2 && (
                <div className="space-y-2">
                  {["Sarah ✓", "Mike ✓", "Lisa ✓", "James ✓"].map((name) => (
                    <div key={name} className="flex items-center justify-between bg-zinc-700 rounded-lg p-2">
                      <span className="text-sm">{name}</span>
                      <span className="text-green-400 text-sm font-bold">$38.25</span>
                    </div>
                  ))}
                </div>
              )}
              {currentStep === 3 && (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-bold">All Paid!</p>
                  <p className="text-zinc-400 text-sm">$153.00 total</p>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm flex items-center gap-2"
            >
              {isPlaying ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pause
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Play
                </>
              )}
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <span className="text-orange-400">⚡</span> Instant
            </h3>
            <p className="text-zinc-400">
              No waiting for Venmo requests. Everyone pays in seconds, right at the table.
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <span className="text-orange-400">🔒</span> Secure
            </h3>
            <p className="text-zinc-400">
              Virtual cards are single-use and encrypted. Your real card is never shared.
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <span className="text-orange-400">🤝</span> Fair
            </h3>
            <p className="text-zinc-400">
              Split equally or by item. Everyone sees exactly what they owe.
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <span className="text-orange-400">📱</span> Easy
            </h3>
            <p className="text-zinc-400">
              Friends join with a link. No app download required to pay.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/split"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full text-lg font-semibold hover:opacity-90"
          >
            Start Splitting Bills
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  );
}
