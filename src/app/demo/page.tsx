"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const DEMO_STEPS = [
  {
    step: 1,
    title: "Enter the bill",
    desc: "Sarah enters the $127.50 brunch bill with 20% tip",
    emoji: "📝",
    detail: "Total with tip: $153.00"
  },
  {
    step: 2,
    title: "Add your crew",
    desc: "Mike, Lisa, and James join via share link",
    emoji: "👥",
    detail: "4 people splitting"
  },
  {
    step: 3,
    title: "Everyone pays",
    desc: "Each person pays their $38.25 share instantly",
    emoji: "💳",
    detail: "Secure virtual cards"
  },
  {
    step: 4,
    title: "Done!",
    desc: "Virtual card pays the restaurant automatically",
    emoji: "✅",
    detail: "Receipt sent to all"
  },
];

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % DEMO_STEPS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-espresso text-cream grain">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-burgundy/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-mustard/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-cream/10 px-4 md:px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-burgundy to-burgundy-light flex items-center justify-center shadow-lg shadow-burgundy/20 group-hover:scale-105 transition-transform">
              <span className="text-lg">🍳</span>
            </div>
            <span className="text-lg font-display font-semibold">Captain Brunch</span>
          </Link>
          <Link
            href="/split"
            className="btn-mustard px-5 py-2.5 rounded-lg text-sm font-medium"
          >
            Try It Now
          </Link>
        </div>
      </header>

      <main className="relative max-w-4xl mx-auto px-4 md:px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-burgundy/20 border border-burgundy/30 rounded-full text-sm text-cream/80 mb-6">
            <span className="text-mustard">▶</span>
            Interactive demo
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">How it works</h1>
          <p className="text-cream/50 text-lg max-w-xl mx-auto">
            See a bill split happen in real-time. No awkward math, no chasing friends for money.
          </p>
        </div>

        {/* Demo Animation */}
        <div className="retro-card rounded-3xl p-8 mb-16">
          {/* Step Indicators */}
          <div className="flex justify-between items-center mb-10 relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-cream/10" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-mustard transition-all duration-500"
              style={{ width: `${(currentStep / (DEMO_STEPS.length - 1)) * 100}%` }}
            />

            {DEMO_STEPS.map((s, i) => (
              <div key={i} className="relative flex flex-col items-center z-10">
                <button
                  onClick={() => { setCurrentStep(i); setIsPlaying(false); }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold mb-3 transition-all ${
                    i <= currentStep
                      ? "bg-mustard text-espresso shadow-lg shadow-mustard/30"
                      : "bg-espresso-light border-2 border-cream/20 text-cream/40"
                  }`}
                >
                  {i + 1}
                </button>
                <p className={`text-xs text-center hidden sm:block transition-colors ${
                  i <= currentStep ? "text-cream" : "text-cream/40"
                }`}>
                  {s.title}
                </p>
              </div>
            ))}
          </div>

          {/* Current Step Display */}
          <div className="text-center py-8">
            <div className="w-24 h-24 rounded-full bg-burgundy/30 flex items-center justify-center mx-auto mb-6 animate-fade-in">
              <span className="text-5xl">{DEMO_STEPS[currentStep].emoji}</span>
            </div>
            <h2 className="text-3xl font-display font-bold mb-3">{DEMO_STEPS[currentStep].title}</h2>
            <p className="text-cream/60 text-lg mb-2">{DEMO_STEPS[currentStep].desc}</p>
            <p className="text-mustard font-medium">{DEMO_STEPS[currentStep].detail}</p>
          </div>

          {/* Mock Phone */}
          <div className="flex justify-center mb-8">
            <div className="w-72 bg-espresso rounded-3xl p-5 border-4 border-cream/10 shadow-2xl">
              <div className="bg-espresso-light rounded-2xl p-4 min-h-[200px]">
                {currentStep === 0 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="text-center">
                      <p className="text-cream/50 text-xs uppercase tracking-wider">Bill Total</p>
                      <p className="text-4xl font-display font-bold text-mustard">$127.50</p>
                    </div>
                    <div className="flex justify-center gap-2">
                      {[15, 18, 20, 25].map((t) => (
                        <div key={t} className={`px-3 py-2 rounded-lg text-sm ${t === 20 ? 'bg-mustard text-espresso font-semibold' : 'bg-espresso text-cream/50'}`}>
                          {t}%
                        </div>
                      ))}
                    </div>
                    <div className="text-center pt-2 border-t border-cream/10">
                      <p className="text-cream/50 text-xs">With tip</p>
                      <p className="text-2xl font-display font-bold">$153.00</p>
                    </div>
                  </div>
                )}
                {currentStep === 1 && (
                  <div className="space-y-3 animate-fade-in">
                    {["Sarah", "Mike", "Lisa", "James"].map((name, i) => (
                      <div key={name} className="flex items-center gap-3 bg-espresso rounded-xl p-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-burgundy to-burgundy-light flex items-center justify-center font-display font-bold shadow-lg shadow-burgundy/20">
                          {name[0]}
                        </div>
                        <span className="font-medium">{name}</span>
                        {i === 0 && <span className="ml-auto text-xs text-mustard uppercase tracking-wider">Host</span>}
                      </div>
                    ))}
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="space-y-3 animate-fade-in">
                    {["Sarah", "Mike", "Lisa", "James"].map((name, i) => (
                      <div key={name} className="flex items-center justify-between bg-espresso rounded-xl p-3" style={{ animationDelay: `${i * 0.2}s` }}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-sage flex items-center justify-center">
                            <svg className="w-5 h-5 text-espresso" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="font-medium">{name}</span>
                        </div>
                        <span className="text-sage font-display font-bold">$38.25</span>
                      </div>
                    ))}
                  </div>
                )}
                {currentStep === 3 && (
                  <div className="text-center space-y-4 animate-fade-in py-4">
                    <div className="w-20 h-20 bg-sage rounded-full flex items-center justify-center mx-auto shadow-lg shadow-sage/30">
                      <svg className="w-10 h-10 text-espresso" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-display font-bold text-2xl">All Paid!</p>
                      <p className="text-cream/50">$153.00 total</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 pt-2">
                      {["Sarah", "Mike", "Lisa", "James"].map((name) => (
                        <span key={name} className="px-3 py-1 bg-espresso rounded-full text-xs">
                          {name}: $38.25
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setCurrentStep((prev) => (prev - 1 + DEMO_STEPS.length) % DEMO_STEPS.length)}
              className="p-3 bg-espresso-light border border-cream/10 hover:border-cream/20 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-6 py-3 bg-espresso-light border border-cream/10 hover:border-cream/20 rounded-xl flex items-center gap-2 transition-colors"
            >
              {isPlaying ? (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pause
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                  Play
                </>
              )}
            </button>
            <button
              onClick={() => setCurrentStep((prev) => (prev + 1) % DEMO_STEPS.length)}
              className="p-3 bg-espresso-light border border-cream/10 hover:border-cream/20 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="deco-divider text-mustard/60 text-sm tracking-widest uppercase mb-16">
          Why Captain Brunch?
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {[
            {
              icon: "⚡",
              title: "Instant",
              desc: "No waiting for Venmo requests. Everyone pays in seconds, right at the table."
            },
            {
              icon: "🔒",
              title: "Secure",
              desc: "Virtual cards are single-use and encrypted. Your real card info is never shared."
            },
            {
              icon: "🤝",
              title: "Fair",
              desc: "Split equally or by item. Everyone sees exactly what they owe - no surprises."
            },
            {
              icon: "📱",
              title: "Easy",
              desc: "Friends join with a link. No app download required to pay their share."
            }
          ].map((feature, i) => (
            <div key={feature.title} className="retro-card rounded-2xl p-6 group hover:scale-[1.02] transition-transform">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-burgundy/30 flex items-center justify-center text-2xl group-hover:bg-burgundy/40 transition-colors">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-display font-semibold mb-2">{feature.title}</h3>
                  <p className="text-cream/50 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How People Use It */}
        <div className="retro-card rounded-3xl p-8 mb-16">
          <h2 className="text-2xl font-display font-bold mb-8 text-center">Perfect for...</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { emoji: "🍳", title: "Sunday Brunch", desc: "Split that avocado toast without the awkward math" },
              { emoji: "🍕", title: "Group Dinners", desc: "Large party? No problem. Everyone pays their share" },
              { emoji: "🎉", title: "Celebrations", desc: "Birthday dinners where the guest of honor is covered" }
            ].map((use) => (
              <div key={use.title} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-burgundy/20 flex items-center justify-center text-3xl mx-auto mb-4">
                  {use.emoji}
                </div>
                <h3 className="font-display font-semibold mb-2">{use.title}</h3>
                <p className="text-cream/50 text-sm">{use.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-16">
          {[
            { value: "2.5s", label: "Average split time" },
            { value: "100%", label: "Split success rate" },
            { value: "$0", label: "Transaction fees" }
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl md:text-5xl font-display font-bold text-mustard mb-2">{stat.value}</p>
              <p className="text-cream/50 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-cream/50 mb-6">Ready to stop chasing friends for money?</p>
          <Link
            href="/split"
            className="inline-flex items-center gap-2.5 btn-mustard px-8 py-4 rounded-xl text-lg font-semibold"
          >
            Start Splitting Bills
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-cream/10 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6 text-center text-cream/40 text-sm">
          <p>Built with Next.js and Claude</p>
        </div>
      </footer>
    </div>
  );
}
