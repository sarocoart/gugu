"use client";

import { useEffect, useState } from "react";
import { colors, font } from "@/lib/theme";

// 큰 글씨 모드 토글. html에 data-big 속성을 붙였다 뗐다 할 뿐이라 아주 단순합니다.
// 실제 확대는 globals.css의 html[data-big="true"]가 담당합니다.
export default function BigTextToggle() {
  const [big, setBig] = useState(false);

  useEffect(() => {
    const saved = typeof window !== "undefined" && window.localStorage.getItem("gugu_big") === "1";
    setBig(saved);
    document.documentElement.setAttribute("data-big", saved ? "true" : "false");
  }, []);

  const toggle = () => {
    const next = !big;
    setBig(next);
    document.documentElement.setAttribute("data-big", next ? "true" : "false");
    try {
      window.localStorage.setItem("gugu_big", next ? "1" : "0");
    } catch {
      // 저장 실패해도 앱이 죽지 않게 넘어갑니다.
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="큰 글씨 모드"
      style={{
        height: 40,
        padding: "0 14px",
        borderRadius: 20,
        border: `1px solid ${colors.line}`,
        background: big ? colors.orangeSoft : colors.surface,
        color: big ? colors.orangeText : colors.textSub,
        fontSize: font.sub,
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      가 {big ? "크게 ✓" : "크게"}
    </button>
  );
}
