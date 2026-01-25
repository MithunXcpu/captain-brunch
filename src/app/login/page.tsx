"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [loading, setLoading] = useState(false);

  const sendCode = () => {
    if (phone.length < 10) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("code");
    }, 1000);
  };

  const verifyCode = () => {
    if (code.length < 4) return;
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("brunch_user", JSON.stringify({ phone, name: "You" }));
      router.push("/split");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
              <span className="text-3xl">🍳</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold mt-4">Captain Brunch</h1>
          <p className="text-zinc-400 mt-2">Sign in to split bills</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          {step === "phone" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-4 bg-zinc-800 border border-zinc-700 rounded-xl text-xl focus:outline-none focus:border-orange-500"
                  maxLength={10}
                />
              </div>
              <button
                onClick={sendCode}
                disabled={phone.length < 10 || loading}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Code"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Enter the code we sent</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="1234"
                  className="w-full px-4 py-4 bg-zinc-800 border border-zinc-700 rounded-xl text-3xl text-center tracking-widest focus:outline-none focus:border-orange-500"
                  maxLength={4}
                />
                <p className="text-zinc-500 text-sm mt-2 text-center">
                  Sent to {phone}
                </p>
              </div>
              <button
                onClick={verifyCode}
                disabled={code.length < 4 || loading}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Continue"}
              </button>
              <button
                onClick={() => setStep("phone")}
                className="w-full py-3 text-zinc-400 hover:text-white text-sm"
              >
                Use different number
              </button>
            </div>
          )}

          {/* Demo hint */}
          <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
            <p className="text-zinc-500 text-sm">
              Demo: Enter any 10-digit number and code 1234
            </p>
          </div>
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="text-zinc-500 hover:text-white text-sm">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
