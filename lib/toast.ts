"use client";

import { toast as sonnerToast } from "sonner";

export type ToastLevel = "INFO" | "WARN" | "CRITICAL";

/**
 * 사용법:
 *   toast("저장 완료", "INFO")
 *   toast("금액이 이상함", "WARN")
 *   toast("DB 연결 실패", "CRITICAL")
 */
export function toast(message: string, level: ToastLevel = "INFO") {
  const base = {
    duration: 3000,
  };

  switch (level) {
    case "INFO":
      // 초록
      return sonnerToast.success(message, {
        ...base,
        style: { background: "#16a34a", color: "white", border: "1px solid #15803d" },
      });

    case "WARN":
      // 주황
      return sonnerToast(message, {
        ...base,
        style: { background: "#f59e0b", color: "black", border: "1px solid #d97706" },
      });

    case "CRITICAL":
      // 빨강
      return sonnerToast.error(message, {
        ...base,
        style: { background: "#ef4444", color: "white", border: "1px solid #dc2626" },
      });

    default:
      return sonnerToast(message, base);
  }
}