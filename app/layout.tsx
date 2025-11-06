import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LocationProvider } from "@/context/LocationContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WhoIsRunning.org - Stop Voting Blind",
  description: "Know every candidate on your ballot in minutes. Free, accurate, non-partisan. Built by voters who got tired of feeling unprepared at the polls.",
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
