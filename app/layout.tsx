import type { Metadata, Viewport } from "next";
import "../src/styles.css";

export const metadata: Metadata = {
  title: "Arcana — Tarot Learning Proof",
  description: "Rider–Waite–Smith visual learning journey",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#181510",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
