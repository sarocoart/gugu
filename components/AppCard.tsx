"use client";

import { useRouter } from "next/navigation";
import type { GuguApp } from "@/lib/data";
import { categories, labels } from "@/lib/labels";
import { colors, font } from "@/lib/theme";
import RunButton from "./RunButton";

// 작품 한 줄 카드 — 모든 목록 화면이 이 컴포넌트만 사용합니다.
export default function AppCard({ app }: { app: GuguApp }) {
  const router = useRouter();
  const cat = categories.find((c) => c.id === app.category);
  const sub = [cat?.name, app.minutes ? `${app.minutes}분` : null].filter(Boolean).join(" · ");

  return (
    <div
      style={{
        background: colors.surface,
        borderRadius: 18,
        padding: 14,
        display: "flex",
        alignItems: "center",
        gap: 14,
        border: `1px solid ${colors.line}`,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: colors.mint,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          flexShrink: 0,
        }}
      >
        {app.emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: font.cardTitle, fontWeight: 600, color: colors.text }}>
          {app.title}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: font.sub, color: colors.textSub }}>{sub}</p>
      </div>
      <RunButton label={labels.run} onClick={() => router.push(`/play/${app.id}`)} />
    </div>
  );
}
