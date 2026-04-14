import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Kakao expense tracker (MVP)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <header style={{ borderBottom: "1px solid #eee", padding: "12px 16px" }}>
          <nav style={{ display: "flex", gap: 12 }}>
            <Link href="/">홈</Link>
            <Link href="/dashboard">대시보드</Link>
            <Link href="/expenses">지출목록</Link>
            <Link href="/expenses/new">추가</Link>
          </nav>
        </header>

        <main style={{ padding: "16px" }}>{children}</main>
      </body>
    </html>
  );
}