import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Importing Inter font for thin sans-serif
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for react-toastify
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Import Inter with weight set to thin (100)
const inter = Inter({
  weight: "100", // Light weight (thin font)
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Ecoshift Corporation",
  description: "Created in NextJs Developed By Leroux Y Xchire",
  icons: {
    icon: "/ecoico.png", // Corrected: This should be an object, not an array
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`} // Apply the thin font here
      >
        <ToastContainer /> {/* This makes sure toasts show up */}
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
