type ExpenseRow = {
  id: string;
  occurredOn: string; // YYYY-MM-DD
  merchant: string | null;
  category: "FOOD" | "CAFE" | "TRANSPORT" | "SHOPPING" | "ETC";
  amount: number;
};

const mock: ExpenseRow[] = [
  { id: "1", occurredOn: "2026-04-14", merchant: "스타벅스", category: "CAFE", amount: 6500 },
  { id: "2", occurredOn: "2026-04-14", merchant: null, category: "FOOD", amount: 12000 },
];

export default function ExpensesPage() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700 }}>지출 목록</h1>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["날짜", "상호", "카테고리", "금액"].map((h) => (
              <th key={h} style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mock.map((e) => (
            <tr key={e.id}>
              <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>{e.occurredOn}</td>
              <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>{e.merchant ?? "-"}</td>
              <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>{e.category}</td>
              <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>{e.amount.toLocaleString("ko-KR")}원</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: "#666" }}>지금은 mock 데이터고, 다음 단계에서 DB에서 읽어오게 만들 거야.</p>
    </div>
  );
}