import type { Metadata } from "next";
import { Noticia_Text } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import Header from "@/components/Header";

const noticiaText = Noticia_Text({
  variable: "--font-noticia-text",
  weight: ["400", "700"],
  subsets: ["latin"],
});

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Innoscripta News - Your Trusted Source for Breaking News",
  description:
    "Innoscripta News - Your Trusted Source for Breaking News, and more.",
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = await headers();
  const searchParams = Object.fromEntries(
    new URLSearchParams(headerStore.get("searchParams") || "")
  );

  return (
    <html lang="en">
      <body className={`${noticiaText.variable} antialiased`}>
       <Header searchParams={searchParams} />
        {children}
      </body>
    </html>
  );
}
