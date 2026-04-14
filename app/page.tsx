export default function HomePage() {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Expense Tracker</h1>
      <p>일단 웹 뼈대부터 만든 다음, 카카오 webhook과 DB를 붙일 거야.</p>
      <ul>
        <li>/dashboard: 월별 요약(그래프)</li>
        <li>/expenses: 지출 목록(표)</li>
        <li>/expenses/new: 지출 추가 폼</li>
      </ul>
    </div>
  );
}