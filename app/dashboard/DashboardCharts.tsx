"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

type ByDayPoint = { date: string; sum: number }; // date: YYYY-MM-DD
type ByCategoryPoint = { category: string; sum: number };

const PIE_COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#6b7280"];

function formatWon(n: number) {
  return n.toLocaleString("ko-KR");
}

export function DashboardCharts(props: {
  byDay: ByDayPoint[];
  byCategory: ByCategoryPoint[];
}) {
  const { byDay, byCategory } = props;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
        <h2 style={{ fontWeight: 700, marginBottom: 8 }}>일자별 지출(이번 달)</h2>
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={byDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(v) => String(v).slice(8, 10)} // DD만 표시
                interval={0}
                minTickGap={6}
              />
              <YAxis tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`} />
              <Tooltip formatter={(value) => `${formatWon(Number(value))}원`} labelFormatter={(label) => `날짜: ${label}`} />
              <Bar dataKey="sum" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p style={{ color: "#666", fontSize: 12, marginTop: 8 }}>
          막대가 높은 날이 “지출이 몰린 날”이야.
        </p>
      </section>

      <section style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
        <h2 style={{ fontWeight: 700, marginBottom: 8 }}>카테고리별 지출(이번 달)</h2>
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={byCategory.filter((x) => x.sum > 0)}
                dataKey="sum"
                nameKey="category"
                outerRadius={95}
                label={(props) => {
                  const payload = props.payload as { category?: string; sum?: number } | undefined;
                  const category = payload?.category ?? "";
                  const sum = payload?.sum ?? 0;

                  const total = Math.max(1, byCategory.reduce((a, b) => a + b.sum, 0));
                  const pct = Math.round((sum / total) * 100);

                  return `${category} (${pct}%)`;
                }}
              >
                {byCategory.map((_, idx) => (
                  <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${formatWon(Number(value))}원`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p style={{ color: "#666", fontSize: 12, marginTop: 8 }}>
          어디에 돈을 쓰는지 한눈에 보여줘.
        </p>
      </section>
    </div>
  );
}