import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Zenvq Suggests — Cybersecurity Advisor for Small Business",
    template: "%s | Zenvq Suggests",
  },
  description:
    "Problem-first cybersecurity & privacy advisor for small businesses. Get fitted security recommendations — not generic product lists.",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
