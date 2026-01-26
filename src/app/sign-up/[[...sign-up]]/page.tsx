"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-espresso text-cream grain flex flex-col">
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
        </div>
      </header>

      {/* Sign Up Form */}
      <main className="relative flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">Join Captain Brunch</h1>
            <p className="text-cream/60">Create an account to start splitting bills</p>
          </div>

          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-espresso-light/50 backdrop-blur-sm border border-cream/10 shadow-xl",
              },
            }}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-cream/10 py-6">
        <div className="max-w-4xl mx-auto px-6 text-center text-cream/40 text-sm">
          <p>Split bills, not friendships</p>
        </div>
      </footer>
    </div>
  );
}
