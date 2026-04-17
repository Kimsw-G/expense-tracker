import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const payload = await req.json().catch(() => null);

  // 연결 확인용: 카카오 스킬 응답(버전 2.0 템플릿)
  return NextResponse.json({
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: `웹훅 연결됨!\n${JSON.stringify(payload)?.slice(0, 500)}`,
          },
        },
      ],
    },
  });
}