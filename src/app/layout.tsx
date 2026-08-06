import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "DawnBeacon — Independent DAWN Internet Community Tool",
  description:
    "An unofficial, independent community tool for exploring DAWN Internet's DePIN network opportunities. Not affiliated with or endorsed by DAWN Internet.",
  keywords: ["DAWN Internet", "DePIN", "wireless network", "Black Box", "validator extension"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-animated min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
