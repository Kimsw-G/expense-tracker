import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DashboardCharts } from "./DashboardCharts";

export const dynamic = "force-dynamic";

function formatWon(n: number) {
  return n.toLocaleString("ko-KR");
}

function kstMonth(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value!;
  return `${get("year")}-${get("month")}`; // YYYY-MM
}

function monthStartEndUtc(month: string): { start: Date; end: Date; daysInMonth: number } {
  const [y, m] = month.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, 1));
  const end = new Date(Date.UTC(y, m, 1));
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return { start, end, daysInMonth };
}

function dateKeyUtc(d: Date) {
  // DATE 컬럼이지만 JS Date로 들어오므로 ISO로 YYYY-MM-DD 만들어 사용
  return d.toISOString().slice(0, 10);
}

export default async function DashboardPage() {
  const month = kstMonth();
  const { start, end, daysInMonth } = monthStartEndUtc(month);

  const expenses = await prisma.expense.findMany({
    where: { occurredOn: { gte: start, lt: end } },
    select: { occurredOn: true, amount: true, category: true, source: true },
  });
  
  const expensesForDaily = expenses.filter((e) => e.source !== "FIXED");

  // total
  const total = expensesForDaily.reduce((acc, e) => acc + e.amount, 0);

  // byDay map (YYYY-MM-DD -> sum)
  const byDayMap = new Map<string, number>();
  for (const e of expensesForDaily) {
    const key = dateKeyUtc(e.occurredOn);
    byDayMap.set(key, (byDayMap.get(key) ?? 0) + e.amount);
  }

  // 날짜 없는 날도 0으로 채워 차트가 예쁘게 나오게
  const [y, m] = month.split("-").map(Number);
  const byDay = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const yyyyMmDd = `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return { date: yyyyMmDd, sum: byDayMap.get(yyyyMmDd) ?? 0 };
  });

  // byCategory
  const categories = ["FOOD", "CAFE", "TRANSPORT", "SHOPPING", "ETC"] as const;
  const byCategoryMap = new Map<string, number>();
  for (const c of categories) byCategoryMap.set(c, 0);

  for (const e of expensesForDaily) {
    byCategoryMap.set(e.category, (byCategoryMap.get(e.category) ?? 0) + e.amount);
  }

  const byCategory = categories.map((c) => ({ category: c, sum: byCategoryMap.get(c) ?? 0 }));

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">대시보드</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{month} (KST 기준)</p>
        </div>
        <div className="flex gap-2">
          <Link href="/expenses" className="btn btn-ghost btn-sm">지출목록</Link>
          <Link href="/expenses/new" className="btn btn-primary btn-sm">+ 추가</Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card">
          <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>이번 달 총합</div>
          <div className="mt-2 text-2xl font-extrabold" style={{ color: "var(--primary)" }}>{formatWon(total)}원</div>
        </div>
        <div className="card">
          <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>지출 건수</div>
          <div className="mt-2 text-2xl font-extrabold">{expensesForDaily.length}건</div>
        </div>
        <div className="card">
          <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>일평균</div>
          <div className="mt-2 text-2xl font-extrabold">{formatWon(Math.round(total / daysInMonth))}원</div>
        </div>
      </div>

      <DashboardCharts byDay={byDay} byCategory={byCategory} />

      <div className="card">
        <h2 className="font-semibold mb-3">빠른 체크</h2>
        <ul className="grid gap-1.5 text-sm" style={{ color: "var(--muted)" }}>
          <li>📅 지출이 몰린 날짜가 있는지 (일자별 막대 확인)</li>
          <li>🥧 카테고리 분포가 이상한지 (도넛 차트 확인)</li>
          <li>✏️ 카카오로 들어온 값이 틀리면 지출목록에서 수정</li>
        </ul>
      </div>
    </div>
  );
}