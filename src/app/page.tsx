import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-espresso text-cream grain">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-burgundy/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-mustard/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-mustard/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-mustard/5 rounded-full" />
      </div>

      {/* Nav */}
      <nav className="absolute top-0 left-0 right-0 px-6 py-5 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-burgundy to-burgundy-light flex items-center justify-center shadow-lg shadow-burgundy/20">
              <span className="text-2xl">🍳</span>
            </div>
            <span className="text-xl font-display font-semibold tracking-tight">Captain Brunch</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-sm text-cream/60 hover:text-cream transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/split"
              className="btn-mustard px-5 py-2.5 rounded-lg text-sm"
            >
              Split a Bill
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative flex flex-col items-center justify-center min-h-screen px-6 py-24">
        <div className="relative text-center max-w-4xl stagger-children">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2.5 px-5 py-2.5 bg-burgundy/20 border border-burgundy/30 rounded-full text-sm text-cream/80 mb-10 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mustard opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-mustard"></span>
            </span>
            No more awkward math
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-8 leading-[1.1] tracking-tight">
            Split bills{" "}
            <span className="relative">
              <span className="text-mustard">instantly</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path d="M1 5.5C47 2 153 2 199 5.5" stroke="#D4A524" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>

          <p className="animate-fade-up text-lg md:text-xl text-cream/60 max-w-2xl mx-auto mb-14 leading-relaxed">
            One tap to split. Everyone pays their share.
            <br className="hidden md:block" />
            No Venmo requests. No &quot;I&apos;ll get you back later.&quot;
          </p>

          {/* CTA */}
          <div className="animate-fade-up flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link
              href="/split"
              className="btn-mustard px-8 py-4 rounded-xl text-lg font-semibold flex items-center gap-2.5 group"
            >
              <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Start a Split
            </Link>
            <Link
              href="/demo"
              className="px-8 py-4 border-2 border-cream/20 rounded-xl text-lg font-medium hover:bg-cream/5 hover:border-cream/30 transition-all"
            >
              See How It Works
            </Link>
          </div>

          {/* Art Deco Divider */}
          <div className="animate-fade-up deco-divider text-mustard/60 text-sm tracking-widest uppercase mb-16">
            How it works
          </div>

          {/* How it works - Feature Cards */}
          <div className="animate-fade-up grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            <div className="retro-card rounded-2xl p-7 text-left group hover:scale-[1.02] transition-transform cursor-default">
              <div className="w-14 h-14 rounded-xl bg-burgundy/30 flex items-center justify-center mb-5 group-hover:bg-burgundy/40 transition-colors">
                <svg className="w-7 h-7 text-mustard" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="text-mustard/80 text-xs font-medium uppercase tracking-wider mb-2">Step 1</div>
              <h3 className="text-xl font-display font-semibold mb-3">Enter the bill</h3>
              <p className="text-cream/50 text-sm leading-relaxed">
                Snap a photo or type the total. Add items if you want to split by what each person ordered.
              </p>
            </div>

            <div className="retro-card rounded-2xl p-7 text-left group hover:scale-[1.02] transition-transform cursor-default">
              <div className="w-14 h-14 rounded-xl bg-burgundy/30 flex items-center justify-center mb-5 group-hover:bg-burgundy/40 transition-colors">
                <svg className="w-7 h-7 text-mustard" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-mustard/80 text-xs font-medium uppercase tracking-wider mb-2">Step 2</div>
              <h3 className="text-xl font-display font-semibold mb-3">Add your crew</h3>
              <p className="text-cream/50 text-sm leading-relaxed">
                Invite friends by phone or share a link. They join in seconds, no signup required.
              </p>
            </div>

            <div className="retro-card rounded-2xl p-7 text-left group hover:scale-[1.02] transition-transform cursor-default">
              <div className="w-14 h-14 rounded-xl bg-burgundy/30 flex items-center justify-center mb-5 group-hover:bg-burgundy/40 transition-colors">
                <svg className="w-7 h-7 text-mustard" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div className="text-mustard/80 text-xs font-medium uppercase tracking-wider mb-2">Step 3</div>
              <h3 className="text-xl font-display font-semibold mb-3">Everyone pays</h3>
              <p className="text-cream/50 text-sm leading-relaxed">
                We create a virtual card that collects from everyone and pays the bill. Done in seconds.
              </p>
            </div>
          </div>

          {/* Virtual Card Preview */}
          <div className="mt-20 flex justify-center animate-fade-up">
            <div className="relative animate-float">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-burgundy/30 blur-3xl rounded-full scale-150" />

              {/* Card */}
              <div className="credit-card relative w-80 h-48 rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-transform warm-glow">
                <div className="relative z-10 flex justify-between items-start mb-6">
                  <div>
                    <p className="text-cream/60 text-xs uppercase tracking-widest font-medium">Virtual Card</p>
                    <p className="text-cream font-display font-bold text-lg mt-1">Captain Brunch</p>
                  </div>
                  <div className="w-11 h-11 bg-cream/10 backdrop-blur rounded-full flex items-center justify-center border border-cream/20">
                    <span className="text-xl">🍳</span>
                  </div>
                </div>
                <p className="relative z-10 text-cream font-card text-lg mb-5">
                  •••• •••• •••• 4829
                </p>
                <div className="relative z-10 flex justify-between items-end">
                  <div>
                    <p className="text-cream/50 text-xs uppercase tracking-wide">Balance</p>
                    <p className="text-cream font-display font-bold text-lg">$127.50</p>
                  </div>
                  <div className="text-right">
                    <p className="text-cream/50 text-xs uppercase tracking-wide">Split</p>
                    <p className="text-cream font-display font-bold text-lg">4 people</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-cream/10 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-cream/40 text-sm">
          <p>Built with Next.js and Claude • Part of{" "}
            <a
              href="https://portfolio-ebon-five-92.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mustard/70 hover:text-mustard transition-colors"
            >
              mithunsnottechnical
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
