import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LocationProvider } from "@/context/LocationContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Who Is Running? - Political Transparency Platform",
  description: "Discover who's running for office in your area. Get bullet point transparency on candidates with resources, videos, quotes, and political ideology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LocationProvider>
          {children}
        </LocationProvider>
      </body>
    </html>
  );
}
