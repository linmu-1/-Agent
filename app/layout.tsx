import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "短剧 Agent",
  description: "短剧 Agent 首页设计稿还原",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
