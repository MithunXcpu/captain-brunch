"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const splitId = searchParams.get("split_id");
  const [confetti, setConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-espresso text-cream grain flex flex-col">
      {/* Confetti Effect */}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ["#D4A524", "#8B2635", "#87A878", "#E07A5F"][
                  Math.floor(Math.random() * 4)
                ],
                width: "10px",
                height: "10px",
                borderRadius: Math.random() > 0.5 ? "50%" : "0",
              }}
            />
          ))}
        </div>
      )}

      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-sage/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-mustard/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-cream/10 px-4 md:px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-burgundy to-burgundy-light flex items-center justify-center shadow-lg shadow-burgundy/20 group-hover:scale-105 transition-transform">
              <span className="text-lg">🍳</span>
            </div>
            <span className="text-lg font-display font-semibold">Captain Brunch</span>
          </Link>
        </div>
      </header>

      {/* Success Content */}
      <main className="relative flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-sage rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-sage/30">
            <svg
              className="w-12 h-12 text-espresso"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-display font-bold mb-3">Payment Complete!</h1>
          <p className="text-cream/60 text-lg mb-8">
            Your share has been paid. Thanks for splitting fairly!
          </p>

          <div className="retro-card rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-center gap-3 text-cream/80">
              <svg className="w-5 h-5 text-mustard" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>A receipt has been sent to your email</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {splitId && (
              <Link
                href={`/api/splits/${splitId}`}
                className="px-6 py-3 bg-espresso-light border border-cream/10 hover:border-cream/20 rounded-xl font-medium transition-colors"
              >
                View Split Details
              </Link>
            )}
            <Link
              href="/"
              className="btn-mustard px-6 py-3 rounded-xl font-semibold"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-cream/10 py-6">
        <div className="max-w-lg mx-auto px-6 text-center text-cream/40 text-sm">
          <p>Split bills, not friendships</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-espresso text-cream grain flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-burgundy/30 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-3xl">🍳</span>
          </div>
          <p className="text-cream/60">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
