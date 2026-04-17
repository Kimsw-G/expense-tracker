import Link from "next/link";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function formatWon(n: number) {
  return n.toLocaleString("ko-KR");
}

function formatDateOnly(d: Date) {
  return d.toISOString().slice(0, 10);
}

async function deleteExpense(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "");

  if (!id) throw new Error("Missing id");

  await prisma.expense.delete({ where: { id } });

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
}

export default async function ExpensesPage() {
  const expenses = await prisma.expense.findMany({
    orderBy: [{ occurredOn: "desc" }, { createdAt: "desc" }],
    take: 200,
  });

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">지출 목록</h1>
        <Link href="/expenses/new" className="btn btn-primary btn-sm">+ 추가</Link>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "#f8fafc" }}>
              {["날짜", "상호", "카테고리", "금액", "메모", "출처", "작업"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: "var(--muted)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {expenses.map((e) => (
              <tr key={e.id} className="transition-colors hover:bg-slate-50" style={{ borderBottom: "1px solid var(--border)" }}>
                <td className="px-4 py-3 tabular-nums">{formatDateOnly(e.occurredOn)}</td>
                <td className="px-4 py-3 font-medium">{e.merchant ?? "-"}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: "#ede9fe", color: "#5b21b6" }}>
                    {e.category}
                  </span>
                </td>
                <td className="px-4 py-3 tabular-nums font-medium">{formatWon(e.amount)}원</td>
                <td className="px-4 py-3" style={{ color: "var(--muted)" }}>{e.memo ?? "-"}</td>
                <td className="px-4 py-3">
                  <span className="rounded px-1.5 py-0.5 text-xs" style={{ background: "#f1f5f9", color: "var(--muted)" }}>
                    {e.source}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/expenses/${e.id}/edit`} className="btn btn-ghost btn-sm">수정</Link>
                    <form action={deleteExpense}>
                      <input type="hidden" name="id" value={e.id} />
                      <button type="submit" className="btn btn-danger">삭제</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}

            {expenses.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center" style={{ color: "var(--muted)" }}>
                  아직 데이터가 없어요.{" "}
                  <Link href="/expenses/new" className="underline">여기서 추가</Link>해 보세요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}