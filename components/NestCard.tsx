"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { GuguApp } from "@/lib/data";
import { categories, labels } from "@/lib/labels";
import { colors, font } from "@/lib/theme";

// 내 둥지 전용 카드 — "하기" + "지우기"가 있고, 지울 때 확인창이 뜹니다.
// onRemove는 실제 삭제 동작(부모가 넘겨줌). 종류마다 지우는 곳이 달라서요.
export default function NestCard({ app, onRemove }: { app: GuguApp; onRemove: (id: string) => void }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const cat = categories.find((c) => c.id === app.category);
  const sub = [cat?.name, app.minutes ? `${app.minutes}분` : null].filter(Boolean).join(" · ");

  return (
    <div
      style={{
        background: colors.surface,
        borderRadius: 18,
        padding: 14,
        border: `1px solid ${colors.line}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
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
            overflow: "hidden",
          }}
        >
          {app.image ? (
            <img src={app.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            app.emoji
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: font.cardTitle, fontWeight: 600, color: colors.text }}>
            {app.title}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: font.sub, color: colors.textSub }}>{sub}</p>
        </div>
        <button
          onClick={() => router.push(`/play/${app.id}`)}
          style={{
            height: 48,
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
          {labels.run}
        </button>
        <button
          onClick={() => setConfirming(true)}
          aria-label={labels.remove}
          style={{
            width: 44,
            height: 48,
            borderRadius: 14,
            border: `1px solid ${colors.line}`,
            background: colors.surface,
            fontSize: 20,
            cursor: "pointer",
            color: colors.textSub,
            flexShrink: 0,
          }}
        >
          🗑️
        </button>
      </div>

      {confirming && (
        <div
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: `1px solid ${colors.line}`,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ flex: 1, fontSize: font.body, color: colors.text, fontWeight: 600 }}>
            {labels.removeConfirm}
          </span>
          <button
            onClick={() => setConfirming(false)}
            style={{
              height: 44,
              padding: "0 18px",
              borderRadius: 22,
              border: `1px solid ${colors.line}`,
              background: colors.surface,
              color: colors.textSub,
              fontSize: font.body,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {labels.cancel}
          </button>
          <button
            onClick={() => onRemove(app.id)}
            style={{
              height: 44,
              padding: "0 18px",
              borderRadius: 22,
              border: "none",
              background: "#E24B4A",
              color: "#FFFFFF",
              fontSize: font.body,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {labels.remove}
          </button>
        </div>
      )}
    </div>
  );
}
