import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  openGraph: {
    siteName: "Link preview site name", // og:site_name
    images: [
      {
        url: "Link preview image URL", // og:image
        width: 1200, // You can specify the width of the image
        height: 630, // You can specify the height of the image
        alt: "Ecoshift Corporation Image", // Alt text for the image
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta property="og:site_name" content="Link preview site name" />
        <meta property="og:image" content="Link preview image URL" />
        <meta
          property="og:title"
          content="Ecoshift Corporation"
        />
        <meta
          property="og:description"
          content="Created in NextJs Developed By Leroux Y Xchire"
        />
        {/* Add any other Open Graph or SEO meta tags here */}
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ToastContainer />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
