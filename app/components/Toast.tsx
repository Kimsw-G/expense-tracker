"use client";

import { Toaster } from "sonner";

export default function Toast() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        // 기본 스타일(필요하면 여기서 더 조정)
        style: {
          fontSize: "14px",
        },
      }}
    />
  );
}