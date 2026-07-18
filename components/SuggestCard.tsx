"use client";

import { useRouter } from "next/navigation";
import type { GuguApp } from "@/lib/data";
import { categories, labels } from "@/lib/labels";
import { colors, font } from "@/lib/theme";

// 내 둥지 하단 추천 목록 카드 — 왼쪽을 누르면 실행 화면, "담기"를 누르면 바로 담깁니다.
export default function SuggestCard({ app, onAdd }: { app: GuguApp; onAdd: (id: string) => void }) {
  const router = useRouter();
  const cat = categories.find((c) => c.id === app.category);

  return (
    <div
      style={{
        background: colors.surface,
        borderRadius: 18,
        padding: 12,
        display: "flex",
        alignItems: "center",
        gap: 12,
        border: `1px solid ${colors.line}`,
      }}
    >
      <button
        onClick={() => router.push(`/play/${app.id}`)}
        aria-label={`${app.title} ${labels.run}`}
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "none",
          border: "none",
          padding: 0,
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 52,
            height: 52,
            borderRadius: 13,
            background: colors.mint,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
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
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: font.body,
              fontWeight: 600,
              color: colors.text,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {app.title}
          </p>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: font.sub,
              color: colors.textSub,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {app.desc}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: font.sub, color: colors.mintText, fontWeight: 600 }}>
            {cat ? `${cat.icon} ${cat.name}` : ""}
          </p>
        </div>
      </button>
      <button
        onClick={() => onAdd(app.id)}
        style={{
          height: 44,
          padding: "0 18px",
          borderRadius: 22,
          border: "none",
          background: colors.orangeSoft,
          color: colors.orangeText,
          fontSize: font.body,
          fontWeight: 600,
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        💛 {labels.save}
      </button>
    </div>
  );
}
