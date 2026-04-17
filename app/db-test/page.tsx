import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export default async function DbTestPage() {
  const count = await prisma.expense.count();

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700 }}>DB Test</h1>
      <p>Expense row count: {count}</p>
      <p>이 페이지가 에러 없이 뜨면 DB 연결 성공.</p>
    </div>
  );
}