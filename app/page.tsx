import Link from "next/link";

export default function HomePage() {
  const links = [
    { href: "/dashboard", icon: "📊", title: "대시보드", desc: "월별 지출 요약 및 카테고리 차트" },
    { href: "/expenses", icon: "📋", title: "지출 목록", desc: "전체 지출 내역 확인 및 수정·삭제" },
    { href: "/expenses/new", icon: "➕", title: "지출 추가", desc: "새 지출을 직접 입력" },
    { href: "/fixed", icon: "🔁", title: "고정소비", desc: "매월 반복되는 고정 지출 관리" },
  ];

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
          안녕하세요 👋
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          카카오페이 알림을 기반으로 지출을 자동으로 기록하고 분석합니다.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {links.map(({ href, icon, title, desc }) => (
          <Link
            key={href}
            href={href}
            className="card flex items-start gap-4 transition-shadow hover:shadow-md"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <span className="text-2xl">{icon}</span>
            <div>
              <div className="font-semibold">{title}</div>
              <div className="mt-0.5 text-sm" style={{ color: "var(--muted)" }}>{desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}