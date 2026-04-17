import Link from "next/link";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { parseYyyyMmDdToDateOnly } from "@/lib/dateOnly";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

function kstMonth(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value!;
  return `${get("year")}-${get("month")}`; // YYYY-MM
}

function monthToFirstDay(month: string): string {
  if (!/^\d{4}-\d{2}$/.test(month)) throw new Error("Invalid month format. Use YYYY-MM");
  return `${month}-01`;
}

async function applyFixedToMonth(formData: FormData) {
  "use server";

  const month = String(formData.get("month") ?? "").trim();
  const ids = formData.getAll("templateId").map(String).filter(Boolean);

  if (!month) {
    redirect(`/fixed?toast=${encodeURIComponent("값을 체크하세요")}&level=WARN`);
  }
  if (ids.length === 0) {
    redirect(`/fixed?toast=${encodeURIComponent("값을 체크하세요")}&level=WARN`);
  }

  const occurredOnStr = monthToFirstDay(month);
  const occurredOn = parseYyyyMmDdToDateOnly(occurredOnStr);

  const templates = await prisma.fixedExpenseTemplate.findMany({
    where: { id: { in: ids }, isActive: true },
  });

  await prisma.expense.createMany({
    data: templates.map((t) => ({
      occurredOn,
      amount: t.amount,
      merchant: t.name,
      memo: t.memo,
      category: "ETC", // 고정소비는 카테고리 하나만
      rawText: `fixed:${t.id}:${month}`,
      source: "FIXED",
    })),
  });

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  revalidatePath("/fixed");
}

async function deleteTemplateActive(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "");
  const next = String(formData.get("next") ?? "");

  if (!id) throw new Error("Missing id");
  if (next !== "true" && next !== "false") throw new Error("Invalid next");

  await prisma.fixedExpenseTemplate.delete({ where: { id } });

  revalidatePath("/fixed");
}

export default async function FixedPage() {
  const month = kstMonth();

  const templates = await prisma.fixedExpenseTemplate.findMany({
    orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">고정소비</h1>
        <div className="flex gap-2">
          <Link href="/fixed/new" className="btn btn-primary btn-sm">+ 템플릿 추가</Link>
          <Link href="/expenses" className="btn btn-ghost btn-sm">지출목록</Link>
        </div>
      </div>

      {/* 단 하나의 form만 유지 */}
      <form action={applyFixedToMonth} className="card grid gap-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="field">
            <span className="field-label">적용할 월 (YYYY-MM)</span>
            <input
              name="month"
              defaultValue={month}
              required
              className="input"
              style={{ width: 160 }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            선택한 템플릿을 해당 월 1일에 추가
          </button>
        </div>

        <p className="text-xs" style={{ color: "var(--muted)" }}>
          생성되는 지출은 <strong>{month}-01</strong> 날짜로 들어가고, 일자별 차트에서는 제외됩니다.
        </p>

        <div className="grid gap-3">
          {templates.map((t) => (
            <div
              key={t.id}
              className="card"
              style={{
                display: "grid",
                gridTemplateColumns: "24px 1fr auto",
                gap: 12,
                alignItems: "center",
                opacity: t.isActive ? 1 : 0.5,
                padding: 12,
              }}
            >
              <input type="checkbox" name="templateId" value={t.id} disabled={!t.isActive} className="w-4 h-4" />

              <div>
                <div className="font-semibold text-sm">
                  {t.name} —{" "}
                  <span style={{ color: "var(--primary)" }}>{t.amount.toLocaleString("ko-KR")}원</span>
                </div>
                <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{t.memo ?? "-"}</div>
              </div>

              <div className="grid gap-1.5" style={{ justifyItems: "end" }}>
                <input type="hidden" name="id" value={t.id} />
                <input type="hidden" name="next" value={String(!t.isActive)} />
                <button
                  type="submit"
                  formAction={deleteTemplateActive}
                  className="btn btn-ghost btn-sm"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}

          {templates.length === 0 && (
            <div className="py-8 text-center text-sm" style={{ color: "var(--muted)" }}>
              템플릿이 없어요.{" "}
              <Link href="/fixed/new" className="underline">여기서 추가</Link>해 보세요.
            </div>
          )}
        </div>
      </form>
    </div>
  );
}