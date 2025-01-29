import type { Metadata } from "next";
//import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "spawnpoint",
  description: "another way to manage ur data ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
