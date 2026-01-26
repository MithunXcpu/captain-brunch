import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Captain Brunch | Split Bills Instantly",
  description: "One tap to split. Everyone pays their share. No awkward Venmo requests.",
  openGraph: {
    title: "Captain Brunch | Split Bills Instantly",
    description: "One tap to split. Everyone pays their share. No awkward Venmo requests.",
    type: "website",
  },
};

// Check if Clerk is properly configured
const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = clerkKey && clerkKey.startsWith("pk_");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html lang="en">
      <body className={`${fraunces.variable} ${dmSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );

  // If Clerk is not configured, render without it
  if (!isClerkConfigured) {
    return content;
  }

  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#D4A524",
          colorBackground: "#1C1410",
          colorText: "#FDF6E3",
          colorInputBackground: "#2A1F1A",
          colorInputText: "#FDF6E3",
          borderRadius: "0.75rem",
        },
        elements: {
          formButtonPrimary: "bg-mustard hover:bg-mustard/90 text-espresso font-semibold",
          card: "bg-espresso-light border border-cream/10",
          headerTitle: "font-display text-cream",
          headerSubtitle: "text-cream/60",
          socialButtonsBlockButton: "bg-espresso border border-cream/20 hover:bg-espresso-light",
          formFieldInput: "bg-espresso border-cream/20 text-cream",
          footerActionLink: "text-mustard hover:text-mustard/80",
        },
      }}
    >
      {content}
    </ClerkProvider>
  );
}
