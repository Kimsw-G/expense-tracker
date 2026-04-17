import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseYyyyMmDdToDateOnly, yyyyMmDdTodayKst } from "@/lib/dateOnly";
import { Category } from "@prisma/client";

async function createExpense(formData: FormData) {
  "use server";

  const occurredOnStr = String(formData.get("occurredOn") ?? "").trim();
  const amountStr = String(formData.get("amount") ?? "").trim();
  const merchant = String(formData.get("merchant") ?? "").trim() || null;
  const memo = String(formData.get("memo") ?? "").trim() || null;
  const categoryStr = String(formData.get("category") ?? "FOOD").trim();

  const amount = Number(amountStr);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("amount must be a positive number");
  }

  const occurredOn = parseYyyyMmDdToDateOnly(occurredOnStr);

  // Category enum 검증
  const category = (Object.values(Category) as string[]).includes(categoryStr)
    ? (categoryStr as Category)
    : Category.FOOD;

  await prisma.expense.create({
    data: {
      occurredOn,
      amount,
      merchant,
      memo,
      category,
      rawText: "(created from web)",
      source: "WEB",
    },
  });

  redirect("/expenses");
}

export default function NewExpensePage() {
  const today = yyyyMmDdTodayKst();

  return (
    <div className="grid gap-6 max-w-lg">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold">지출 추가</h1>
      </div>

      <div className="card">
        <form action={createExpense} className="grid gap-5">
          <div className="field">
            <span className="field-label">날짜</span>
            <input
              name="occurredOn"
              defaultValue={today}
              placeholder="2026-04-14"
              required
              className="input"
            />
          </div>

          <div className="field">
            <span className="field-label">금액 (원)</span>
            <input
              name="amount"
              placeholder="6500"
              required
              inputMode="numeric"
              className="input"
            />
          </div>

          <div className="field">
            <span className="field-label">상호 (선택)</span>
            <input
              name="merchant"
              placeholder="스타벅스"
              className="input"
            />
          </div>

          <div className="field">
            <span className="field-label">카테고리</span>
            <select name="category" defaultValue="FOOD" className="input">
              <option value="FOOD">식비</option>
              <option value="CAFE">카페</option>
              <option value="TRANSPORT">교통</option>
              <option value="SHOPPING">쇼핑</option>
              <option value="ETC">기타</option>
            </select>
          </div>

          <div className="field">
            <span className="field-label">메모 (선택)</span>
            <input
              name="memo"
              placeholder="라떼"
              className="input"
            />
          </div>

          <button type="submit" className="btn btn-primary">저장</button>
        </form>
      </div>
    </div>
  );
}