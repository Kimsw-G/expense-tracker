import { parseYyyyMmDdToDateOnly } from "@/lib/dateOnly";

export type ParsedExpense = {
  occurredOn: Date;
  amount: number;
  merchant: string;
};

function todayKstYyyyMmDd(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value!;
  return `${get("year")}-${get("month")}-${get("day")}`; // YYYY-MM-DD
}

function parseAmount(token: string): number | null {
  const cleaned = token.replace(/[, ]/g, "");
  if (!/^\d+$/.test(cleaned)) return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export function parseKakaoExpenseUtterance(utteranceRaw: string): ParsedExpense {
  const utterance = utteranceRaw.trim();
  if (!utterance) throw new Error("empty utterance");

  // split by spaces
  const tokens = utterance.split(/\s+/);

  let dateStr: string | null = null;
  let amountTokenIndex = 0;

  // optional date in front
  if (tokens[0] && /^\d{4}-\d{2}-\d{2}$/.test(tokens[0])) {
    dateStr = tokens[0];
    amountTokenIndex = 1;
  }

  const amountToken = tokens[amountTokenIndex];
  const amount = amountToken ? parseAmount(amountToken) : null;
  if (amount == null) throw new Error("invalid amount");

  const merchantTokens = tokens.slice(amountTokenIndex + 1);
  const merchant = merchantTokens.join(" ").trim();
  if (!merchant) throw new Error("missing merchant/memo");

  const occurredOnStr = dateStr ?? todayKstYyyyMmDd();
  const occurredOn = parseYyyyMmDdToDateOnly(occurredOnStr);

  return { occurredOn, amount, merchant };
}