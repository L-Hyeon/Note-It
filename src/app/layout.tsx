import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Note-It",
  description: "Note Everything",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <html lang="ko-kr">{children}</html>;
}
