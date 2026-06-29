import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "うまかったよランキング",
  description: "作って美味しかったレシピを残すアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
