import type { Metadata } from "next";
import type { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: 'black',
}

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "../providers/QueryProvider";
import InstallButton from "../components/InstallButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="black" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <InstallButton />
        <QueryProvider>
          {children}
        </QueryProvider>

      </body>
    </html>
  );
}
