"use client";

import { links, features } from "@/lib/features";
import { colors, font } from "@/lib/theme";

// 화면 하단에 고정되는 "빌트마켓 가기" 바.
// lib/features.ts의 biltButtons를 true로 바꾸면 나타나고, false면 완전히 숨겨집니다.
// PC·모바일 모두 하단에 표시돼요.
export default function BiltBar() {
  if (!features.biltButtons) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        padding: "10px 16px",
        background: colors.surface,
        borderTop: `1px solid ${colors.line}`,
        zIndex: 10,
      }}
    >
      <a
        href={links.bilt}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          width: "100%",
          maxWidth: 480,
          height: 48,
          lineHeight: "48px",
          textAlign: "center",
          borderRadius: 24,
          background: colors.orange,
          color: "#FFFFFF",
          fontSize: font.button,
          fontWeight: 700,
          textDecoration: "none",
        }}
      >
        🛒 빌트마켓 가기
      </a>
    </div>
  );
}
