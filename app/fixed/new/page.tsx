import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function createFixedTemplate(formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "").trim();
  const amountStr = String(formData.get("amount") ?? "").trim();
  const memo = String(formData.get("memo") ?? "").trim() || null;

  if (!name) throw new Error("name is required");

  const amount = Number(amountStr);
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("amount must be a positive number");

  await prisma.fixedExpenseTemplate.create({
    data: {
      name,
      amount,
      memo,
      isActive: true,
    },
  }); 

  redirect("/fixed");
}

export default function NewFixedTemplatePage() {
  return (
    <div className="grid gap-6 max-w-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">고정소비 템플릿 추가</h1>
        <Link href="/fixed" className="btn btn-ghost btn-sm">← 목록</Link>
      </div>

      <div className="card">
        <form action={createFixedTemplate} className="grid gap-5">
          <div className="field">
            <span className="field-label">이름</span>
            <input
              name="name"
              placeholder="월세 / 넷플릭스 / 통신비"
              required
              className="input"
            />
          </div>

          <div className="field">
            <span className="field-label">금액 (원)</span>
            <input
              name="amount"
              placeholder="55000"
              required
              inputMode="numeric"
              className="input"
            />
          </div>

          <div className="field">
            <span className="field-label">메모 (선택)</span>
            <input
              name="memo"
              placeholder="매월 자동 결제"
              className="input"
            />
          </div>

          <button type="submit" className="btn btn-primary">저장</button>
        </form>
      </div>
    </div>
  );
}