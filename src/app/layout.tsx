import type { Metadata } from "next";
import { Dela_Gothic_One, Nunito, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";

const delaGothicOne = Dela_Gothic_One({
  weight: "400",
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const nunito = Nunito({
  weight: ["400", "600", "700"],
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: "400",
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Konbini Scout",
    template: "%s — Konbini Scout",
  },
  description: "Scout the shelf. Find your five. Discover and share your favourite Japanese convenience store snacks.",
  openGraph: {
    siteName: "Konbini Scout",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${delaGothicOne.variable} ${nunito.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-rice-paper text-nori font-body">
        <ClerkProvider>
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--color-surface)",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
                fontFamily: "var(--font-body)",
              },
            }}
          />
        </ClerkProvider>
        <Analytics />
      </body>
    </html>
  );
}
