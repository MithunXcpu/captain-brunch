"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: "easeOut" as const,
    },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const steps = [
  {
    icon: (
      <svg className="w-8 h-8 text-mustard" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    step: "01",
    title: "Snap the receipt",
    description: "Take a photo of your receipt or enter the total manually. We handle the rest.",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-mustard" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    step: "02",
    title: "Split the items",
    description: "Drag items to each person. Split equally, by item, or custom amounts.",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-mustard" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    step: "03",
    title: "Settle up",
    description: "Everyone pays their share instantly. No IOUs, no chasing people down.",
  },
];

const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Instant splits",
    description: "No signup needed for guests. Share a link and everyone joins in seconds.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Bank-level security",
    description: "End-to-end encryption. We never store card details on our servers.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
    title: "SMS invites",
    description: "Send a text to your crew. They tap the link and they are in. That simple.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Split history",
    description: "Track every split, every payment, every time. Full transparency for the group.",
  },
];

const stats = [
  { value: "10K+", label: "Bills split" },
  { value: "$2.4M", label: "Settled up" },
  { value: "4.9/5", label: "App rating" },
  { value: "<3s", label: "To split" },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <div className="min-h-screen bg-espresso text-cream grain overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-burgundy/10 rounded-full blur-3xl animate-bg-drift-1" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-mustard/5 rounded-full blur-3xl animate-bg-drift-2" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-coral/5 rounded-full blur-3xl animate-bg-drift-3" />
        {/* Deco rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-mustard/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-mustard/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-burgundy/5 rounded-full" />
        {/* Diner checkered strip */}
        <div className="absolute bottom-0 left-0 right-0 h-2 diner-check opacity-50" />
      </div>

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" as const }}
        className="fixed top-0 left-0 right-0 px-6 py-5 z-50 backdrop-blur-md bg-espresso/70 border-b border-cream/5"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-burgundy to-burgundy-light flex items-center justify-center shadow-lg shadow-burgundy/20">
              <span className="text-2xl">&#x1F373;</span>
            </div>
            <span className="text-xl font-display font-semibold tracking-tight">Captain Brunch</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
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
      </motion.nav>

      {/* Hero */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative flex flex-col items-center justify-center min-h-screen px-6 pt-32 pb-24"
      >
        <div className="relative text-center max-w-4xl">
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-burgundy/20 border border-burgundy/30 rounded-full text-sm text-cream/80 mb-10 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mustard opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-mustard" />
            </span>
            No more awkward math at brunch
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-8 leading-[1.1] tracking-tight"
          >
            Split bills{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-mustard to-mustard-light">
                instantly
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <motion.path
                  d="M1 5.5C47 2 153 2 199 5.5"
                  stroke="#D4A524"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" as const }}
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-lg md:text-xl text-cream/60 max-w-2xl mx-auto mb-14 leading-relaxed"
          >
            Snap the receipt. Everyone pays their share.
            <br className="hidden md:block" />
            No Venmo requests. No &quot;I&apos;ll get you back later.&quot;
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <Link
              href="/split"
              className="btn-mustard px-8 py-4 rounded-xl text-lg font-semibold flex items-center gap-2.5 group"
            >
              <svg className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Start a Split
            </Link>
            <Link
              href="/demo"
              className="px-8 py-4 border-2 border-cream/20 rounded-xl text-lg font-medium hover:bg-cream/5 hover:border-cream/30 transition-all duration-300 group"
            >
              See Demo
              <span className="inline-block ml-2 transition-transform group-hover:translate-x-1 duration-300">&rarr;</span>
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" as const }}
              className="w-6 h-10 border-2 border-cream/20 rounded-full flex items-start justify-center p-1.5"
            >
              <div className="w-1.5 h-1.5 bg-mustard rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Bar */}
      <section className="relative py-16 border-y border-cream/10">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                custom={i}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-display font-bold text-mustard mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-cream/40 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" as const }}
            className="text-center mb-16"
          >
            <div className="deco-divider text-mustard/60 text-sm tracking-widest uppercase mb-6">
              How it works
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Three steps to{" "}
              <span className="text-mustard">fair splits</span>
            </h2>
            <p className="text-cream/50 text-lg max-w-xl mx-auto">
              No more mental math at the table. Let Captain Brunch handle the numbers.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid md:grid-cols-3 gap-6"
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                variants={fadeUp}
                custom={i}
                className="retro-card rounded-2xl p-8 text-left group hover:border-mustard/40 transition-all duration-300 relative overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-mustard/0 to-mustard/0 group-hover:from-mustard/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-burgundy/30 flex items-center justify-center group-hover:bg-burgundy/50 transition-colors duration-300 group-hover:shadow-lg group-hover:shadow-burgundy/20">
                      {step.icon}
                    </div>
                    <span className="text-5xl font-display font-bold text-cream/5 group-hover:text-mustard/10 transition-colors duration-300">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-3 group-hover:text-mustard transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-cream/50 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-mustard/0 to-transparent group-hover:via-mustard/50 transition-all duration-500" />
              </motion.div>
            ))}
          </motion.div>

          {/* Connecting dots between steps (desktop) */}
          <div className="hidden md:flex justify-center mt-8 gap-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-mustard/20" />
            ))}
          </div>
        </div>
      </section>

      {/* Virtual Card Showcase */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left: Card */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" as const }}
              className="flex justify-center"
            >
              <div className="relative">
                {/* Glow */}
                <div className="absolute inset-0 bg-burgundy/30 blur-3xl rounded-full scale-150" />

                {/* Card */}
                <motion.div
                  animate={{ y: [0, -8, 0], rotate: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" as const }}
                  className="credit-card relative w-80 h-48 rounded-2xl p-6 shadow-2xl warm-glow"
                >
                  <div className="relative z-10 flex justify-between items-start mb-6">
                    <div>
                      <p className="text-cream/60 text-xs uppercase tracking-widest font-medium">Virtual Card</p>
                      <p className="text-cream font-display font-bold text-lg mt-1">Captain Brunch</p>
                    </div>
                    <div className="w-11 h-11 bg-cream/10 backdrop-blur rounded-full flex items-center justify-center border border-cream/20">
                      <span className="text-xl">&#x1F373;</span>
                    </div>
                  </div>
                  <p className="relative z-10 text-cream font-card text-lg mb-5">
                    &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4829
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
                </motion.div>
              </div>
            </motion.div>

            {/* Right: Copy */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" as const }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                One virtual card.{" "}
                <span className="text-mustard">Everyone pays.</span>
              </h2>
              <p className="text-cream/50 text-lg leading-relaxed mb-8">
                We generate a virtual card that collects from every person in your group and pays the restaurant directly. No more fronting the bill and chasing friends.
              </p>
              <div className="space-y-4">
                {["Instant collection from all members", "Auto-calculated tips and tax", "Payment confirmation for everyone"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-sage/20 flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-cream/70 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" as const }}
            className="text-center mb-16"
          >
            <div className="deco-divider text-mustard/60 text-sm tracking-widest uppercase mb-6">
              Features
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Built for the <span className="text-mustard">real world</span>
            </h2>
            <p className="text-cream/50 text-lg max-w-xl mx-auto">
              Every feature designed around what actually happens when friends share a meal.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid md:grid-cols-2 gap-5"
          >
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                custom={i}
                className="retro-card rounded-2xl p-7 group hover:border-mustard/30 transition-all duration-300 relative overflow-hidden cursor-default"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-mustard/0 to-burgundy/0 group-hover:from-mustard/5 group-hover:to-burgundy/5 transition-all duration-500 pointer-events-none" />

                <div className="relative z-10 flex gap-5">
                  <div className="w-12 h-12 rounded-xl bg-burgundy/30 flex items-center justify-center shrink-0 text-mustard group-hover:bg-burgundy/50 group-hover:shadow-lg group-hover:shadow-burgundy/20 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-semibold mb-2 group-hover:text-mustard transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-cream/50 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="relative py-24 md:py-32 border-y border-cream/10">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" as const }}
            className="text-center mb-16"
          >
            <div className="deco-divider text-mustard/60 text-sm tracking-widest uppercase mb-6">
              Loved by groups
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold">
              What people are <span className="text-mustard">saying</span>
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                quote: "Finally, no more spreadsheets after every group dinner. This app just gets it.",
                name: "Sarah K.",
                role: "Brunch organizer",
              },
              {
                quote: "I split a $400 dinner for 8 people in under 30 seconds. My friends were shocked.",
                name: "Marcus T.",
                role: "Weekend regular",
              },
              {
                quote: "The virtual card is genius. No one has to float the bill anymore.",
                name: "Priya M.",
                role: "Foodie crew lead",
              },
            ].map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                variants={fadeUp}
                custom={i}
                className="retro-card rounded-2xl p-7 relative"
              >
                {/* Quote mark */}
                <span className="text-5xl font-display text-mustard/15 absolute top-4 right-6 leading-none">
                  &ldquo;
                </span>
                <p className="text-cream/70 text-sm leading-relaxed mb-6 relative z-10">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-burgundy/40 flex items-center justify-center text-sm font-semibold text-mustard">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-cream/80">{testimonial.name}</p>
                    <p className="text-xs text-cream/40">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
              Ready to split <span className="text-mustard">smarter</span>?
            </h2>
            <p className="text-cream/50 text-lg mb-10 max-w-lg mx-auto">
              Join thousands of groups who ditched the calculator app and the &quot;just Venmo me&quot; texts.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/split"
                className="btn-mustard px-10 py-4 rounded-xl text-lg font-semibold flex items-center gap-2.5 group"
              >
                <svg className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Start Splitting Free
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 border-2 border-cream/20 rounded-xl text-lg font-medium hover:bg-cream/5 hover:border-cream/30 transition-all duration-300"
              >
                Questions? Reach Out
              </Link>
            </div>
            <p className="text-cream/30 text-sm mt-6">
              Free to use. No credit card required.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-cream/10 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-burgundy to-burgundy-light flex items-center justify-center">
                <span className="text-lg">&#x1F373;</span>
              </div>
              <span className="text-lg font-display font-semibold">Captain Brunch</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-cream/40">
              <Link href="/demo" className="hover:text-cream/70 transition-colors">Demo</Link>
              <Link href="/contact" className="hover:text-cream/70 transition-colors">Contact</Link>
              <a
                href="https://portfolio-ebon-five-92.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cream/70 transition-colors"
              >
                Portfolio
              </a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-cream/5 text-center text-cream/30 text-sm">
            <p>Built by Mithun Manjunatha</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
