import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Toast from "./components/Toast";
import ToastListener from "./components/ToastFromQuery";


export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Kakao expense tracker (MVP)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm" style={{ borderColor: "var(--border)" }}>
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <nav className="flex h-14 items-center gap-1">
              <Link
                href="/"
                className="mr-4 text-base font-bold tracking-tight"
                style={{ color: "var(--primary)" }}
              >
                💰 MyBudget
              </Link>
              {[
                { href: "/dashboard", label: "대시보드" },
                { href: "/expenses", label: "지출목록" },
                { href: "/expenses/new", label: "+ 지출추가" },
                { href: "/fixed", label: "고정소비" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-slate-100"
                  style={{ color: "var(--muted)" }}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <Toast />
        <ToastListener />
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
      </body>
    </html>
  );
}