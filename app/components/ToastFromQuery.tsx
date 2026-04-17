"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, type ToastLevel } from "@/lib/toast";

export default function ToastFromQuery() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const msg = params.get("toast");
    if (!msg) return;

    const level = (params.get("level") ?? "INFO") as ToastLevel;

    toast(msg, level);

    // 재토스트 방지: URL에서 제거
    const url = new URL(window.location.href);
    url.searchParams.delete("toast");
    url.searchParams.delete("level");
    router.replace(url.pathname + url.search, { scroll: false });
  }, [params, router]);

  return null;
}