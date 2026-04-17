import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseKakaoExpenseUtterance } from "@/lib/kakaoExpenseParser";

type KakaoSkillRequest = {
  userRequest?: {
    utterance?: string;
    user?: { id?: string; type?: string };
    timezone?: string;
  };
};

function simpleText(text: string) {
  return NextResponse.json({
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: { text },
        },
      ],
    },
  });
}

export async function POST(req: Request) {
  const payload = (await req.json().catch(() => null)) as KakaoSkillRequest | null;

  const utterance = payload?.userRequest?.utterance?.trim() ?? "";
  if (!utterance) {
    return simpleText("입력값이 비어있어요. 예) 4500 점심");
  }

  try {
    const parsed = parseKakaoExpenseUtterance(utterance);

    await prisma.expense.create({
      data: {
        occurredOn: parsed.occurredOn,
        amount: parsed.amount,
        merchant: parsed.merchant,
        memo: null,
        category: "ETC",
        rawText: utterance,
        source: "KAKAO",
      },
    });

    const msg =
      `✅ 저장 완료\n` +
      `- 날짜: ${parsed.occurredOn.toISOString().slice(0, 10)}\n` +
      `- 금액: ${parsed.amount.toLocaleString("ko-KR")}원\n` +
      `- 내용: ${parsed.merchant}`;

    return simpleText(msg);
  } catch (e) {
    // 사용자 입력 파싱 실패
    return simpleText(
      `형식이 올바르지 않아요.\n` +
        `예) 4500 점심\n` +
        `예) 12,000 스타벅스\n` +
        `예) 2026-04-17 4500 점심`
    );
  }
}