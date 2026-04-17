export function parseYyyyMmDdToDateOnly(yyyyMmDd: string): Date {
  // DATE 컬럼에 넣을 목적: 시간대 이슈 줄이기 위해 UTC 자정으로 고정
  // (KST 기준으로만 쓴다고 해도, 날짜만 저장이면 이 방식이 편함)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(yyyyMmDd)) {
    throw new Error("Invalid date format. Use YYYY-MM-DD");
  }
  return new Date(`${yyyyMmDd}T00:00:00.000Z`);
}

export function yyyyMmDdTodayKst(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const get = (type: string) => parts.find(p => p.type === type)?.value!;
  return `${get("year")}-${get("month")}-${get("day")}`;
}