import Link from "next/link";

export const metadata = {
  title: "Contact | Captain Brunch",
  description: "Get in touch with us. We'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen grain" style={{ backgroundColor: "#1C1410", color: "#FDF6E3" }}>
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 right-20 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(139, 38, 53, 0.12)" }}
        />
        <div
          className="absolute bottom-20 left-10 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(212, 165, 36, 0.06)" }}
        />
      </div>

      {/* Nav */}
      <nav className="relative px-6 py-5 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                background: "linear-gradient(to bottom right, #8B2635, #A83242)",
                boxShadow: "0 4px 14px rgba(139, 38, 53, 0.2)",
              }}
            >
              <span className="text-2xl">&#x1F373;</span>
            </div>
            <span
              className="text-xl font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              Captain Brunch
            </span>
          </Link>
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium transition-colors"
            style={{ color: "rgba(253, 246, 227, 0.6)" }}
            onMouseEnter={undefined}
          >
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm mb-8 backdrop-blur-sm"
            style={{
              backgroundColor: "rgba(139, 38, 53, 0.2)",
              border: "1px solid rgba(139, 38, 53, 0.3)",
              color: "rgba(253, 246, 227, 0.8)",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: "#D4A524" }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ backgroundColor: "#D4A524" }}
              />
            </span>
            Say Hello
          </div>

          <h1
            className="text-4xl md:text-5xl font-bold mb-5 tracking-tight"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            Get in{" "}
            <span className="relative">
              <span style={{ color: "#D4A524" }}>Touch</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 120 8" fill="none">
                <path d="M1 5.5C28 2 92 2 119 5.5" stroke="#D4A524" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "rgba(253, 246, 227, 0.55)" }}>
            Have a question or want to work together? Drop me a line.
          </p>
        </div>

        {/* Art Deco Divider */}
        <div className="deco-divider text-sm tracking-widest uppercase mb-12" style={{ color: "rgba(212, 165, 36, 0.5)" }}>
          Contact Form
        </div>

        {/* Form Card */}
        <div
          className="rounded-2xl p-8 md:p-10"
          style={{
            background: "linear-gradient(145deg, #2A201A 0%, #1C1410 100%)",
            border: "1px solid rgba(212, 165, 36, 0.15)",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
          }}
        >
          <form
            action="https://formspree.io/f/xnjbjvng"
            method="POST"
            className="flex flex-col gap-6"
          >
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="text-sm font-medium uppercase tracking-wider"
                style={{ color: "rgba(212, 165, 36, 0.8)", fontFamily: "var(--font-display), Georgia, serif" }}
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Your full name"
                className="retro-input w-full px-4 py-3 rounded-lg text-sm"
                style={{ color: "#FDF6E3" }}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-medium uppercase tracking-wider"
                style={{ color: "rgba(212, 165, 36, 0.8)", fontFamily: "var(--font-display), Georgia, serif" }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="you@example.com"
                className="retro-input w-full px-4 py-3 rounded-lg text-sm"
                style={{ color: "#FDF6E3" }}
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="phone"
                className="text-sm font-medium uppercase tracking-wider"
                style={{ color: "rgba(212, 165, 36, 0.8)", fontFamily: "var(--font-display), Georgia, serif" }}
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="(555) 123-4567"
                className="retro-input w-full px-4 py-3 rounded-lg text-sm"
                style={{ color: "#FDF6E3" }}
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="message"
                className="text-sm font-medium uppercase tracking-wider"
                style={{ color: "rgba(212, 165, 36, 0.8)", fontFamily: "var(--font-display), Georgia, serif" }}
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Tell me what's on your mind..."
                className="retro-input w-full px-4 py-3 rounded-lg text-sm resize-none"
                style={{ color: "#FDF6E3" }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-mustard w-full px-8 py-4 rounded-xl text-lg font-semibold mt-2 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Send Message
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center mt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: "rgba(253, 246, 227, 0.5)" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative py-8" style={{ borderTop: "1px solid rgba(253, 246, 227, 0.1)" }}>
        <div className="max-w-6xl mx-auto px-6 text-center text-sm" style={{ color: "rgba(253, 246, 227, 0.4)" }}>
          <p>
            Built with Next.js and Claude{" "}
            <span style={{ color: "rgba(253, 246, 227, 0.2)" }}>|</span>{" "}
            <a
              href="https://portfolio-ebon-five-92.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors"
              style={{ color: "rgba(212, 165, 36, 0.7)" }}
            >
              mithunsnottechnical
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
