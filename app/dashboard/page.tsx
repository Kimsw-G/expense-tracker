export default function DashboardPage() {
  // 나중에 month=YYYY-MM로 통계 API 붙일 예정
  const month = "2026-04";

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700 }}>대시보드</h1>
      <p>월: {month}</p>

      <section style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
        <h2 style={{ fontWeight: 600 }}>이번 달 총합(임시)</h2>
        <div style={{ fontSize: 28, fontWeight: 800 }}>123,000원</div>
      </section>

      <section style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
        <h2 style={{ fontWeight: 600 }}>그래프 영역(임시)</h2>
        <p>여기에 일자별 합계 / 카테고리별 합계 차트를 넣을 거야.</p>
      </section>
    </div>
  );
}