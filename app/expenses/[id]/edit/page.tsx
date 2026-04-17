import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { parseYyyyMmDdToDateOnly } from "@/lib/dateOnly";

export const dynamic = "force-dynamic";
import { Category } from "@prisma/client";

function formatDateOnly(d: Date) {
  return d.toISOString().slice(0, 10);
}

async function updateExpense(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "");
  const occurredOnStr = String(formData.get("occurredOn") ?? "").trim();
  const amountStr = String(formData.get("amount") ?? "").trim();
  const merchant = String(formData.get("merchant") ?? "").trim() || null;
  const memo = String(formData.get("memo") ?? "").trim() || null;
  const categoryStr = String(formData.get("category") ?? "FOOD").trim();

  if (!id) throw new Error("Missing id");

  const amount = Number(amountStr);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("amount must be a positive number");
  }

  const occurredOn = parseYyyyMmDdToDateOnly(occurredOnStr);

  const category = (Object.values(Category) as string[]).includes(categoryStr)
    ? (categoryStr as Category)
    : Category.FOOD;

  await prisma.expense.update({
    where: { id },
    data: {
      occurredOn,
      amount,
      merchant,
      memo,
      category,
    },
  });

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  redirect("/expenses");
}

export default async function EditExpensePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const expense = await prisma.expense.findUnique({ where: { id } });
  if (!expense) {
    return (
      <div className="grid gap-4">
        <h1 className="text-xl font-bold">수정</h1>
        <p style={{ color: "var(--muted)" }}>해당 지출을 찾을 수 없어요.</p>
        <Link href="/expenses" className="btn btn-ghost" style={{ width: "fit-content" }}>← 목록으로</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 max-w-lg">
      <h1 className="text-xl font-bold">지출 수정</h1>

      <div className="card">
        <form action={updateExpense} className="grid gap-5">
          <input type="hidden" name="id" value={expense.id} />

          <div className="field">
            <span className="field-label">날짜</span>
            <input
              name="occurredOn"
              defaultValue={formatDateOnly(expense.occurredOn)}
              required
              className="input"
            />
          </div>

          <div className="field">
            <span className="field-label">금액 (원)</span>
            <input
              name="amount"
              defaultValue={String(expense.amount)}
              required
              inputMode="numeric"
              className="input"
            />
          </div>

          <div className="field">
            <span className="field-label">상호</span>
            <input
              name="merchant"
              defaultValue={expense.merchant ?? ""}
              className="input"
            />
          </div>

          <div className="field">
            <span className="field-label">카테고리</span>
            <select name="category" defaultValue={expense.category} className="input">
              <option value="FOOD">식비</option>
              <option value="CAFE">카페</option>
              <option value="TRANSPORT">교통</option>
              <option value="SHOPPING">쇼핑</option>
              <option value="ETC">기타</option>
            </select>
          </div>

          <div className="field">
            <span className="field-label">메모</span>
            <input
              name="memo"
              defaultValue={expense.memo ?? ""}
              className="input"
            />
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn btn-primary flex-1">저장</button>
            <Link href="/expenses" className="btn btn-ghost flex-1 text-center">취소</Link>
          </div>
        </form>
      </div>

      <div className="text-xs" style={{ color: "var(--muted)" }}>
        <div>생성: {expense.createdAt.toISOString()}</div>
        <div>수정: {expense.updatedAt.toISOString()}</div>
        <div>rawText: {expense.rawText}</div>
      </div>
    </div>
  );
}