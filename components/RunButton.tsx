"use client";

import { colors, font } from "@/lib/theme";

// 오렌지 "하기" 버튼 — 크기·색을 바꾸면 앱 전체가 함께 바뀝니다.
export default function RunButton({
  label,
  onClick,
  wide = false,
}: {
  label: string;
  onClick: () => void;
  wide?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        height: 48,
        minWidth: wide ? "100%" : 88,
        padding: "0 20px",
        borderRadius: 24,
        border: "none",
        background: colors.orange,
        color: "#FFFFFF",
        fontSize: font.button,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}
