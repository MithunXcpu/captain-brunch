import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="absolute top-0 left-0 right-0 px-6 py-4 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
              <span className="text-2xl">🍳</span>
            </div>
            <span className="text-xl font-bold">Captain Brunch</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/split" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm font-medium transition-colors">
              Split a Bill
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex flex-col items-center justify-center min-h-screen px-6 py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-amber-500/10" />

        <div className="relative text-center max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full text-sm text-orange-400 mb-8">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            No more awkward math
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Split bills{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
              instantly
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12">
            One tap to split. Everyone pays their share. No Venmo requests. No &quot;I&apos;ll get you back later.&quot;
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/split"
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Start a Split
            </Link>
            <Link
              href="/demo"
              className="px-8 py-4 border border-zinc-700 rounded-full text-lg font-semibold hover:bg-zinc-900 transition-colors"
            >
              See How It Works
            </Link>
          </div>

          {/* How it works */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-left">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Enter the bill</h3>
              <p className="text-zinc-400 text-sm">
                Snap a photo or type the total. Add items if you want to split by what each person ordered.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-left">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Add your crew</h3>
              <p className="text-zinc-400 text-sm">
                Invite friends by phone or share a link. They join in seconds, no signup required.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-left">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Everyone pays</h3>
              <p className="text-zinc-400 text-sm">
                We create a virtual card that collects from everyone and pays the bill. Done in seconds.
              </p>
            </div>
          </div>

          {/* Virtual Card Preview */}
          <div className="mt-16 flex justify-center">
            <div className="relative">
              <div className="w-80 h-48 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-6 shadow-2xl shadow-orange-500/20 transform hover:scale-105 transition-transform">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-orange-200 text-xs uppercase tracking-wider">Virtual Card</p>
                    <p className="text-white font-bold text-lg">Captain Brunch</p>
                  </div>
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xl">🍳</span>
                  </div>
                </div>
                <p className="text-white font-mono text-lg tracking-widest mb-4">
                  •••• •••• •••• 4829
                </p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-orange-200 text-xs">Balance</p>
                    <p className="text-white font-bold">$127.50</p>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-200 text-xs">Split</p>
                    <p className="text-white font-bold">4 people</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-zinc-500 text-sm">
          <p>Built with Next.js and Claude • Part of{" "}
            <a href="https://portfolio-ebon-five-92.vercel.app" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">
              mithunsnottechnical
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
